package com.magnii.minotor.repository;

import com.magnii.minotor.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByStatus(Delivery.DeliveryStatus status);
    List<Delivery> findByOrderId(Long orderId);
}