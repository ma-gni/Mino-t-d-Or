package com.magnii.minotor.dto;

import com.magnii.minotor.model.DeliveryStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryDTO {
    private Long id;
    private Long orderId;

    private Long clientId;
    private String clientUsername;

    private String address;

    private LocalDate scheduledDate;
    private LocalDate deliveredDate;

    private DeliveryStatus status;

    private String carrierName;
    private String trackingNumber;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}