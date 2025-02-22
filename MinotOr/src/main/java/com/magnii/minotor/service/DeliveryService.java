package com.magnii.minotor.service;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.mapper.DeliveryMapper;
import com.magnii.minotor.model.Delivery;
import com.magnii.minotor.repository.DeliveryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final DeliveryMapper deliveryMapper;

    public DeliveryService(DeliveryRepository deliveryRepository, DeliveryMapper deliveryMapper) {
        this.deliveryRepository = deliveryRepository;
        this.deliveryMapper = deliveryMapper;
    }
    public List<DeliveryDTO> getAllDeliveries() {
        List<Delivery> deliveries = deliveryRepository.findAll();
        return deliveryMapper.toDto(deliveries);
    }
    public DeliveryDTO getDeliveryById(long id) {
        Delivery delivery = deliveryRepository.findById(id).orElseThrow();
        return deliveryMapper.toDto(delivery);
    }
    public DeliveryDTO createDelivery(DeliveryDTO deliveryDTO) {
        Delivery delivery = deliveryMapper.toEntity(deliveryDTO);
        deliveryRepository.save(delivery);
        return deliveryMapper.toDto(delivery);
    }
    public DeliveryDTO updateDelivery(DeliveryDTO deliveryDTO) {
        Delivery updatedDelivery = deliveryMapper.toEntity(deliveryDTO);
        Delivery delivery = deliveryRepository.findById(updatedDelivery.getId()).orElseThrow();
        delivery.setId(delivery.getId());
        delivery.setStatus(delivery.getStatus());
        delivery.setAddress(delivery.getAddress());
        deliveryRepository.save(delivery);
        return deliveryMapper.toDto(delivery);
    }

    public void deleteDelivery(long id) {
        deliveryRepository.deleteById(id);
    }
}
