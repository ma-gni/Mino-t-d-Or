package com.magnii.minotor.controller;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*")
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

    // Nouveaux endpoints pour l'app mobile

    // Récupérer les livraisons en cours pour un livreur
    @GetMapping("/mobile/active")
    public ResponseEntity<List<DeliveryDTO>> getActiveDeliveries() {
        List<DeliveryDTO> deliveries = deliveryService.getAllDeliveries();
        // Filtrer pour ne garder que les livraisons en cours
        List<DeliveryDTO> activeDeliveries = deliveries.stream()
            .filter(d -> "SHIPPED".equals(d.getStatus()))
            .toList();
        return ResponseEntity.ok(activeDeliveries);
    }

    // Mettre à jour le statut d'une livraison (simplifié pour mobile)
    @PutMapping("/mobile/{id}/status")
    public ResponseEntity<Map<String, Object>> updateDeliveryStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            DeliveryDTO deliveryDTO = deliveryService.getDeliveryById(id);
            deliveryDTO.setStatus(status);
            
            DeliveryDTO updated = deliveryService.updateDelivery(deliveryDTO);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Statut mis à jour avec succès",
                "delivery", updated
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "error", "Erreur lors de la mise à jour"
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Scanner un QR code pour valider une livraison
    @PostMapping("/mobile/scan")
    public ResponseEntity<Map<String, Object>> scanQRCode(@RequestBody Map<String, String> request) {
        try {
            String qrCode = request.get("qrCode");
            
            // Logique simple : le QR code contient l'ID de la livraison
            Long deliveryId = Long.parseLong(qrCode);
            DeliveryDTO delivery = deliveryService.getDeliveryById(deliveryId);
            
            // Mettre à jour le statut à DELIVERED
            delivery.setStatus("DELIVERED");
            DeliveryDTO updated = deliveryService.updateDelivery(delivery);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Livraison validée avec succès",
                "delivery", updated
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                "success", false,
                "error", "QR Code invalide ou livraison introuvable"
            );
            return ResponseEntity.badRequest().body(response);
        }
    }
}