package com.magnii.minotor.service;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.mapper.DeliveryMapper;
import com.magnii.minotor.model.Delivery;
import com.magnii.minotor.model.DeliveryStatus;
import com.magnii.minotor.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryMapper mapper;

    public DeliveryDTO create(DeliveryDTO dto) {
        Delivery entity = mapper.toEntity(dto);
        if (entity.getStatus() == null) {
            entity.setStatus(DeliveryStatus.PENDING);
        }
        return mapper.toDto(deliveryRepository.save(entity));
    }

    public DeliveryDTO createForPaidOrder(Long orderId,
                                          Long clientId,
                                          String clientUsername,
                                          String address,
                                          LocalDate scheduledDate) {
        Delivery entity = Delivery.builder()
                .clientId(clientId)
                .clientUsername(clientUsername)
                .address(address)
                .scheduledDate(scheduledDate)
                .status(DeliveryStatus.PENDING)
                .build();
        return mapper.toDto(deliveryRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public DeliveryDTO get(Long id) {
        return deliveryRepository.findById(id).map(mapper::toDto).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<DeliveryDTO> listAll() {
        return deliveryRepository.findAll().stream().map(mapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<DeliveryDTO> listByClient(Long clientId) {
        return deliveryRepository.findByClientId(clientId).stream().map(mapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<DeliveryDTO> listByStatus(DeliveryStatus status) {
        return deliveryRepository.findByStatus(status).stream().map(mapper::toDto).toList();
    }

    public DeliveryDTO updateStatus(Long id, DeliveryStatus status, LocalDate deliveredDate) {
        Delivery d = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found: " + id));
        d.setStatus(status);
        if (status == DeliveryStatus.DELIVERED) {
            d.setDeliveredDate(deliveredDate != null ? deliveredDate : LocalDate.now());
        }
        return mapper.toDto(d);
    }

    public DeliveryDTO updateTracking(Long id, String carrierName, String trackingNumber) {
        Delivery d = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found: " + id));
        d.setCarrierName(carrierName);
        d.setTrackingNumber(trackingNumber);
        return mapper.toDto(d);
    }

    public DeliveryDTO updateAddress(Long id, String address) {
        Delivery d = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found: " + id));
        d.setAddress(address);
        return mapper.toDto(d);
    }

    public void delete(Long id) {
        deliveryRepository.deleteById(id);
    }
}