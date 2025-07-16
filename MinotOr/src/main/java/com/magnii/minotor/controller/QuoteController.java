package com.magnii.minotor.controller;

import com.magnii.minotor.dto.QuoteDTO;
import com.magnii.minotor.service.QuoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @PostMapping
    public ResponseEntity<QuoteDTO> createQuote(@RequestBody QuoteDTO dto) {
        QuoteDTO saved = quoteService.createQuote(dto);
        return ResponseEntity.ok(saved);
    }
}