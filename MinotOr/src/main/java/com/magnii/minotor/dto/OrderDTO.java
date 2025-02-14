package com.magnii.minotor.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long userId;
    private LocalDateTime datePlaced;
    private String status;
    private BigDecimal total;
    private List<OrderDetailDTO> orderDetails;
}