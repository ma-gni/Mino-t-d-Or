package com.magnii.minotor.service;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.mapper.DeliveryMapper;
import com.magnii.minotor.model.Delivery;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.repository.DeliveryRepository;
import com.magnii.minotor.repository.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final DeliveryMapper deliveryMapper;
    private final OrderRepository orderRepository;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           DeliveryMapper deliveryMapper,
                           OrderRepository orderRepository) {
        this.deliveryRepository = deliveryRepository;
        this.deliveryMapper = deliveryMapper;
        this.orderRepository = orderRepository;
    }

    public List<DeliveryDTO> getAllDeliveries() {
        return deliveryMapper.toDto(deliveryRepository.findAll());
    }

    public DeliveryDTO getDeliveryById(long id) {
        return deliveryRepository.findById(id)
                .map(deliveryMapper::toDto)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found")
                );
    }

    public DeliveryDTO createDelivery(DeliveryDTO dto) {
        // map DTO → entity (orderId still in dto)
        Delivery delivery = deliveryMapper.toEntity(dto);

        // lookup order or 404
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found")
                );
        delivery.setOrder(order);

        // persist
        Delivery saved = deliveryRepository.save(delivery);
        return deliveryMapper.toDto(saved);
    }

    public DeliveryDTO updateDelivery(DeliveryDTO dto) {
        Delivery existing = deliveryRepository.findById(dto.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found")
                );

        try {
            existing.setStatus(Delivery.DeliveryStatus.valueOf(dto.getStatus()));
        } catch (IllegalArgumentException iae) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid delivery status: " + dto.getStatus()
            );
        }

        existing.setAddress(dto.getAddress());
        Delivery updated = deliveryRepository.save(existing);
        return deliveryMapper.toDto(updated);
    }

    public void deleteDelivery(long id) {
        if (!deliveryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found");
        }
        deliveryRepository.deleteById(id);
    }
}