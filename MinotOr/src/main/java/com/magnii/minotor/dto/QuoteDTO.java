package com.magnii.minotor.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuoteDTO {
    private Long id;
    private LocalDateTime requestDate;
    private boolean accepted;
    private Long userId;
    private List<QuoteItemDTO> items;
}