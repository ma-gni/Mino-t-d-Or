package com.magnii.minotor.service;

import com.magnii.minotor.dto.*;
import com.magnii.minotor.mapper.QuoteMapper;
import com.magnii.minotor.model.*;
import com.magnii.minotor.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final QuoteItemRepository quoteItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final QuoteMapper quoteMapper;

    public QuoteService(QuoteRepository quoteRepository,
                        QuoteItemRepository quoteItemRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        QuoteMapper quoteMapper) {
        this.quoteRepository = quoteRepository;
        this.quoteItemRepository = quoteItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.quoteMapper = quoteMapper;
    }

    @Transactional
    public QuoteDTO createQuote(QuoteDTO quoteDTO) {
        User user = userRepository.findById(quoteDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Quote quote = new Quote();
        quote.setUser(user);
        quote.setRequestDate(LocalDateTime.now());
        quote.setStatus(QuoteStatus.PENDING);
        quote.setAccepted(false);
        quote.setDiscountPercent(null);
        quote.setAdminComment(null);
        final Quote saved = quoteRepository.save(quote);

        // items
        List<QuoteItem> items = quoteDTO.getItems().stream().map(it -> {
            Product p = productRepository.findById(it.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + it.getProductId()));
            QuoteItem qi = new QuoteItem();
            qi.setQuote(saved);
            qi.setProduct(p);
            qi.setQuantity(it.getQuantity());
            return qi;
        }).toList();

        quoteItemRepository.saveAll(items);
        saved.setItems(items);

        return quoteMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<QuoteDTO> getQuotesForUser(Long userId) {
        return quoteRepository.findByUserIdOrderByRequestDateDesc(userId)
                .stream().map(quoteMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<QuoteDTO> getPendingQuotes() {
        return quoteRepository.findByStatusOrderByRequestDateDesc(QuoteStatus.PENDING)
                .stream().map(quoteMapper::toDto).toList();
    }

    @Transactional
    public QuoteDTO approveQuote(Long quoteId, Long adminUserId, BigDecimal discountPercent, String comment) {
        Quote quote = quoteRepository.findByIdAndStatus(quoteId, QuoteStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Quote not found or not pending"));

        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        quote.setStatus(QuoteStatus.APPROVED);
        quote.setAccepted(true); // keep legacy in sync
        quote.setDecisionDate(LocalDateTime.now());
        quote.setApprovedBy(admin);
        quote.setAdminComment(comment);
        quote.setDiscountPercent(discountPercent != null ? discountPercent : null);

        return quoteMapper.toDto(quoteRepository.save(quote));
    }

    @Transactional
    public QuoteDTO rejectQuote(Long quoteId, Long adminUserId, String comment) {
        Quote quote = quoteRepository.findByIdAndStatus(quoteId, QuoteStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Quote not found or not pending"));

        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        quote.setStatus(QuoteStatus.REJECTED);
        quote.setAccepted(false); // legacy
        quote.setDecisionDate(LocalDateTime.now());
        quote.setApprovedBy(admin);
        quote.setAdminComment(comment);
        quote.setDiscountPercent(null);

        return quoteMapper.toDto(quoteRepository.save(quote));
    }
}