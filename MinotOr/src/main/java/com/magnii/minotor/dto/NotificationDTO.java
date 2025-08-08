package com.magnii.minotor.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String type; // "delivery_update", "new_delivery", "system"
    private LocalDateTime createdAt;
    private Boolean isRead;
    private Long deliveryId; // Optionnel, pour les notifications liées aux livraisons
} 