package com.magnii.minotor.dto;
import lombok.Data;

@Data
public class DeliveryDTO {
    private Long id;
    private Long orderId;
    private String status;
    private String address;
}