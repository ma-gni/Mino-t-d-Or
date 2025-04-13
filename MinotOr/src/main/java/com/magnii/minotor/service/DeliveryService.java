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

    public DeliveryService(DeliveryRepository deliveryRepository, DeliveryMapper deliveryMapper, OrderRepository orderRepository) {
        this.deliveryRepository = deliveryRepository;
        this.deliveryMapper = deliveryMapper;
        this.orderRepository = orderRepository;
    }
    public List<DeliveryDTO> getAllDeliveries() {
        List<Delivery> deliveries = deliveryRepository.findAll();
        return deliveryMapper.toDto(deliveries);
    }
    public DeliveryDTO getDeliveryById(long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found"));
        return deliveryMapper.toDto(delivery);
    }
    public DeliveryDTO createDelivery(DeliveryDTO deliveryDTO) {
        Delivery delivery = deliveryMapper.toEntity(deliveryDTO);

        // Fetch and set the actual Order entity
        Order order = orderRepository.findById(deliveryDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        delivery.setOrder(order);

        deliveryRepository.save(delivery);
        return deliveryMapper.toDto(delivery);
    }
    public DeliveryDTO updateDelivery(DeliveryDTO deliveryDTO) {
        Delivery existingDelivery = deliveryRepository.findById(deliveryDTO.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Delivery not found"));

        try {
            existingDelivery.setStatus(Delivery.DeliveryStatus.valueOf(deliveryDTO.getStatus()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid delivery status: " + deliveryDTO.getStatus());
        }
        existingDelivery.setAddress(deliveryDTO.getAddress());

        Delivery updatedDelivery = deliveryRepository.save(existingDelivery);
        return deliveryMapper.toDto(updatedDelivery);
    }

    public void deleteDelivery(long id) {
        deliveryRepository.deleteById(id);
    }
}
