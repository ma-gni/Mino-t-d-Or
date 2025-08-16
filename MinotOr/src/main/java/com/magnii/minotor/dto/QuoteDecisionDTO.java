package com.magnii.minotor.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class QuoteDecisionDTO {
    private BigDecimal discountPercent; // nullable; apply e.g. 10.0 for 10%
    private String comment;             // optional
}