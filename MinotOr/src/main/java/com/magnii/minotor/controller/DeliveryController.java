package com.magnii.minotor.controller;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService){
        this.deliveryService = deliveryService;
    }

    @GetMapping
    public ResponseEntity<List<DeliveryDTO>> getAllDeliveries(){
        List<DeliveryDTO> deliveries = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDTO> getDeliveryById(@PathVariable Long id){
        DeliveryDTO deliveryDTO = deliveryService.getDeliveryById(id);
        return ResponseEntity.ok(deliveryDTO);
    }

    @PostMapping
    public ResponseEntity<DeliveryDTO> createDelivery(@RequestBody DeliveryDTO deliveryDTO){
        DeliveryDTO createdDelivery = deliveryService.createDelivery(deliveryDTO);
        return ResponseEntity.ok(createdDelivery);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryDTO> updateDelivery(@PathVariable Long id, @RequestBody DeliveryDTO deliveryDTO){
        // Assuming the update method uses the DTO's id, ensure consistency or perform additional checks here.
        DeliveryDTO updatedDelivery = deliveryService.updateDelivery(deliveryDTO);
        return ResponseEntity.ok(updatedDelivery);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id){
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }
}