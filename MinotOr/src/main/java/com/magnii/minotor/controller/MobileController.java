package com.magnii.minotor.controller;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.dto.DriverStatsDTO;
import com.magnii.minotor.dto.LocationDTO;
import com.magnii.minotor.dto.NotificationDTO;
import com.magnii.minotor.service.DeliveryService;
import com.magnii.minotor.service.UserService;
import com.magnii.minotor.service.MobileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mobile")
@CrossOrigin(origins = "*")
public class MobileController {

    private final DeliveryService deliveryService;
    private final UserService userService;
    private final MobileService mobileService;

    public MobileController(DeliveryService deliveryService, UserService userService, MobileService mobileService) {
        this.deliveryService = deliveryService;
        this.userService = userService;
        this.mobileService = mobileService;
    }

    // Récupérer les livraisons actives pour un livreur
    @GetMapping("/deliveries/active")
    public ResponseEntity<List<DeliveryDTO>> getActiveDeliveriesForDriver() {
        List<DeliveryDTO> activeDeliveries = mobileService.getActiveDeliveriesForDriver();
        return ResponseEntity.ok(activeDeliveries);
    }

    // Confirmer une livraison
    @PostMapping("/deliveries/{id}/confirm")
    public ResponseEntity<Map<String, Object>> confirmDelivery(@PathVariable Long id) {
        Map<String, Object> response = mobileService.confirmDelivery(id);
        
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Mettre à jour la position du livreur
    @PostMapping("/location/update")
    public ResponseEntity<Map<String, Object>> updateDriverLocation(@RequestBody LocationDTO location) {
        Map<String, Object> response = mobileService.updateDriverLocation(location);
        
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Récupérer les statistiques d'un livreur
    @GetMapping("/stats/driver/{driverId}")
    public ResponseEntity<DriverStatsDTO> getDriverStats(@PathVariable Long driverId) {
        try {
            DriverStatsDTO stats = mobileService.getDriverStats(driverId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Scanner un QR code pour valider une livraison
    @PostMapping("/qr/scan")
    public ResponseEntity<Map<String, Object>> scanQRCode(@RequestBody Map<String, String> request) {
        String qrCode = request.get("qrCode");
        Map<String, Object> response = mobileService.validateQRCode(qrCode);
        
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Générer un QR code pour une livraison
    @PostMapping("/qr/generate/{deliveryId}")
    public ResponseEntity<Map<String, Object>> generateQRCode(@PathVariable Long deliveryId) {
        Map<String, Object> response = mobileService.generateQRCode(deliveryId);
        
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Récupérer les notifications d'un utilisateur
    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@PathVariable Long userId) {
        // Simulation des notifications pour la démo
        // Ici vous pourriez récupérer les vraies notifications depuis la base de données
        return ResponseEntity.ok(List.of()); // Liste vide pour la démo
    }

    // Marquer une notification comme lue
    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Map<String, Object>> markNotificationAsRead(@PathVariable Long notificationId) {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Notification marquée comme lue");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Erreur lors de la mise à jour de la notification");
            return ResponseEntity.badRequest().body(response);
        }
    }
} 