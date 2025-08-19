package com.magnii.minotor.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👇 real 1–1 relation to Order (unique FK)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", unique = true)
    private Order order;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(name = "client_username", length = 150)
    private String clientUsername;

    @Column(nullable = false, length = 500)
    private String address;

    private LocalDate scheduledDate;
    private LocalDate deliveredDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeliveryStatus status;

    @Column(length = 150)
    private String carrierName;

    @Column(length = 150)
    private String trackingNumber;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        final var now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) this.status = DeliveryStatus.PENDING;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}