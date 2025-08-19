package com.magnii.minotor.repository;

import com.magnii.minotor.model.Delivery;
import com.magnii.minotor.model.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByClientId(Long clientId);
    List<Delivery> findByStatus(DeliveryStatus status);
    List<Delivery> findByOrderId(Long orderId);
    List<Delivery> findByScheduledDateBetween(LocalDate start, LocalDate end);
    List<Delivery> findByClientIdAndStatus(Long clientId, DeliveryStatus status);
}