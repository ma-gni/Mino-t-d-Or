package com.magnii.minotor.dto;

import lombok.Data;

@Data
public class StockDTO {
    private Long id;
    private Long productId;
    private Long warehouseId;
    private int quantity;
}