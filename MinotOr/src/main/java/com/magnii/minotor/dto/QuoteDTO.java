package com.magnii.minotor.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class QuoteDTO {
    private Long id;
    private Long userId;
    private LocalDateTime requestDate;

    private String status;
    private Boolean accepted;

    private BigDecimal discountPercent;
    private String adminComment;
    private LocalDateTime decisionDate;
    private Long approvedByUserId;

    private List<QuoteItemDTO> items;

    private BigDecimal totalHtBeforeDiscount;
    private BigDecimal totalHtAfterDiscount;
}