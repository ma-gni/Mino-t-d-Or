package com.magnii.minotor.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DeliveryDTO {
    private Long id;
    private Long orderId;
    private String status;
    private String address;
    
    // Champs ajoutés pour l'app mobile
    private String clientName;
    private String clientPhone;
    private String city;
    private String postalCode;
    private LocalDateTime deliveryDate;
    private List<ProductDTO> products;
    private String qrCode;
    private Double latitude;
    private Double longitude;
}