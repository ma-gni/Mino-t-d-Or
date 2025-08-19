package com.magnii.minotor.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class QuoteItemDTO {
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPriceHt;
}