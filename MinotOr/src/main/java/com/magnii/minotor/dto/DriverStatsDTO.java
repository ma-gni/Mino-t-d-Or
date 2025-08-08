package com.magnii.minotor.dto;

import lombok.Data;
import java.util.List;

@Data
public class DriverStatsDTO {
    private Long driverId;
    private String driverName;
    private Integer totalDeliveries;
    private Integer completedThisWeek;
    private Integer pendingDeliveries;
    private Double averageRating;
    private List<DeliveryDTO> recentDeliveries;
    private Integer totalDistance; // en km
    private Integer averageDeliveryTime; // en minutes
} 