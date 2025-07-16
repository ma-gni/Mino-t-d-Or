package com.magnii.minotor.service;

import com.magnii.minotor.dto.QuoteDTO;
import com.magnii.minotor.dto.QuoteItemDTO;
import com.magnii.minotor.model.*;
import com.magnii.minotor.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final QuoteItemRepository quoteItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public QuoteService(QuoteRepository quoteRepository,
                        QuoteItemRepository quoteItemRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository) {
        this.quoteRepository = quoteRepository;
        this.quoteItemRepository = quoteItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public QuoteDTO createQuote(QuoteDTO quoteDTO) {
        User user = userRepository.findById(quoteDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Quote quote = new Quote();
        quote.setUser(user);
        quote.setRequestDate(LocalDateTime.now());
        quote.setAccepted(false);
        final Quote savedQuote = quoteRepository.save(quote);

        List<QuoteItem> items = quoteDTO.getItems().stream().map(itemDTO -> {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            QuoteItem item = new QuoteItem();
            item.setProduct(product);
            item.setQuote(savedQuote);
            item.setQuantity(itemDTO.getQuantity());
            return item;
        }).collect(Collectors.toList());

        quoteItemRepository.saveAll(items);
        savedQuote.setItems(items);

        return quoteDTO;
    }
}