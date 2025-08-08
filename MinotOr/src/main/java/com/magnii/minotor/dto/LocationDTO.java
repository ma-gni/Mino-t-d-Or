package com.magnii.minotor.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LocationDTO {
    private Long driverId;
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;
    private String address;
    private Long deliveryId; // Optionnel, pour tracker une livraison spécifique
} 