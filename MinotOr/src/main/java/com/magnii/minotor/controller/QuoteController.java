package com.magnii.minotor.controller;

import com.magnii.minotor.dto.*;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.UserRepository;
import com.magnii.minotor.service.QuoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final QuoteService quoteService;
    private final UserRepository userRepository;

    public QuoteController(QuoteService quoteService, UserRepository userRepository) {
        this.quoteService = quoteService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<QuoteDTO> createQuote(@RequestBody QuoteDTO dto, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        User me = userRepository.findByUsername(auth.getName()).orElse(null);
        if (me == null) return ResponseEntity.status(401).build();

        dto.setUserId(me.getId()); // trust token
        return ResponseEntity.ok(quoteService.createQuote(dto));
    }

    // Boulanger reads his quotes
    @GetMapping("/me")
    public ResponseEntity<List<QuoteDTO>> myQuotes(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        User me = userRepository.findByUsername(auth.getName()).orElse(null);
        if (me == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(quoteService.getQuotesForUser(me.getId()));
    }

    // Admin/commercial sees pending quotes
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN','COMMERCIAL')")
    public ResponseEntity<List<QuoteDTO>> pendingQuotes() {
        return ResponseEntity.ok(quoteService.getPendingQuotes());
    }

    // Admin approves
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','COMMERCIAL')")
    public ResponseEntity<QuoteDTO> approve(@PathVariable Long id,
                                            @RequestBody(required = false) QuoteDecisionDTO body,
                                            Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        User admin = userRepository.findByUsername(auth.getName()).orElse(null);
        if (admin == null) return ResponseEntity.status(401).build();

        var discount = body != null ? body.getDiscountPercent() : null;
        var comment  = body != null ? body.getComment() : null;

        return ResponseEntity.ok(
                quoteService.approveQuote(id, admin.getId(), discount, comment)
        );
    }

    // Admin rejects
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','COMMERCIAL')")
    public ResponseEntity<QuoteDTO> reject(@PathVariable Long id,
                                           @RequestBody(required = false) QuoteDecisionDTO body,
                                           Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        User admin = userRepository.findByUsername(auth.getName()).orElse(null);
        if (admin == null) return ResponseEntity.status(401).build();

        var comment = body != null ? body.getComment() : null;

        return ResponseEntity.ok(
                quoteService.rejectQuote(id, admin.getId(), comment)
        );
    }
}