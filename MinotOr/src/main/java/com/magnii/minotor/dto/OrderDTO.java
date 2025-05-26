package com.magnii.minotor.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;

    @NotNull
    private Long userId;

    @NotNull
    private LocalDateTime datePlaced;

    @NotBlank
    private String status;

    @NotNull @DecimalMin("0.00")
    private BigDecimal total;

    private List<OrderDetailDTO> orderDetails;
}