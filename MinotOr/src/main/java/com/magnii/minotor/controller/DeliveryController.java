package com.magnii.minotor.controller;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.model.DeliveryStatus;
import com.magnii.minotor.service.DeliveryService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping
    public ResponseEntity<List<DeliveryDTO>> listAll(
            @RequestParam(value = "status", required = false) DeliveryStatus status,
            @RequestParam(value = "clientId", required = false) Long clientId
    ) {
        if (clientId != null && status != null) {
            return ResponseEntity.ok(
                    deliveryService.listByClient(clientId).stream()
                            .filter(d -> status.equals(d.getStatus()))
                            .toList()
            );
        }
        if (clientId != null) {
            return ResponseEntity.ok(deliveryService.listByClient(clientId));
        }
        if (status != null) {
            return ResponseEntity.ok(deliveryService.listByStatus(status));
        }
        return ResponseEntity.ok(deliveryService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDTO> get(@PathVariable Long id) {
        DeliveryDTO dto = deliveryService.get(id);
        return (dto != null) ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<DeliveryDTO> create(@RequestBody DeliveryDTO dto) {
        return ResponseEntity.ok(deliveryService.create(dto));
    }

    @PostMapping("/for-paid-order")
    public ResponseEntity<DeliveryDTO> createForPaidOrder(@RequestBody CreateForOrderRequest req) {
        return ResponseEntity.ok(
                deliveryService.createForPaidOrder(
                        req.getOrderId(),
                        req.getClientId(),
                        req.getClientUsername(),
                        req.getAddress(),
                        req.getScheduledDate()
                )
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest req
    ) {
        return ResponseEntity.ok(
                deliveryService.updateStatus(id, req.getStatus(), req.getDeliveredDate())
        );
    }

    @PutMapping("/{id}/tracking")
    public ResponseEntity<DeliveryDTO> updateTracking(
            @PathVariable Long id,
            @RequestBody UpdateTrackingRequest req
    ) {
        return ResponseEntity.ok(
                deliveryService.updateTracking(id, req.getCarrierName(), req.getTrackingNumber())
        );
    }

    @PutMapping("/{id}/address")
    public ResponseEntity<DeliveryDTO> updateAddress(
            @PathVariable Long id,
            @RequestBody UpdateAddressRequest req
    ) {
        return ResponseEntity.ok(
                deliveryService.updateAddress(id, req.getAddress())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deliveryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class CreateForOrderRequest {
        private Long orderId;
        private Long clientId;
        private String clientUsername;
        private String address;
        private LocalDate scheduledDate;
    }

    @Data
    public static class UpdateStatusRequest {
        private DeliveryStatus status;
        private LocalDate deliveredDate;
    }

    @Data
    public static class UpdateTrackingRequest {
        private String carrierName;
        private String trackingNumber;
    }

    @Data
    public static class UpdateAddressRequest {
        private String address;
    }
}