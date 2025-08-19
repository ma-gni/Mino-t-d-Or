package com.magnii.minotor.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class QuoteDTO {
    private Long id;
    private Long userId;
    private String username;                 // ← add
    private String status;
    private Boolean accepted;
    private BigDecimal discountPercent;
    private String adminComment;
    private Instant decisionDate;
    private Long approvedByUserId;

    private BigDecimal totalHtBeforeDiscount;
    private BigDecimal totalHtAfterDiscount;

    private List<QuoteItemDTO> items;
}