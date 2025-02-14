package com.magnii.minotor.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderDetailDTO {
    private Long id;
    private Long orderId;
    private Long productId;
    private int quantity;
    private BigDecimal priceAtOrder;
}