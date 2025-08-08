package com.magnii.minotor.service;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.dto.DriverStatsDTO;
import com.magnii.minotor.dto.LocationDTO;
import com.magnii.minotor.dto.NotificationDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class MobileService {

    private final DeliveryService deliveryService;
    private final UserService userService;

    public MobileService(DeliveryService deliveryService, UserService userService) {
        this.deliveryService = deliveryService;
        this.userService = userService;
    }

    /**
     * Récupère les livraisons actives pour un livreur
     */
    public List<DeliveryDTO> getActiveDeliveriesForDriver() {
        List<DeliveryDTO> allDeliveries = deliveryService.getAllDeliveries();
        
        return allDeliveries.stream()
            .filter(delivery -> "SHIPPED".equals(delivery.getStatus()))
            .map(this::enrichDeliveryData)
            .toList();
    }

    /**
     * Confirme une livraison
     */
    public Map<String, Object> confirmDelivery(Long deliveryId) {
        try {
            DeliveryDTO delivery = deliveryService.getDeliveryById(deliveryId);
            delivery.setStatus("DELIVERED");
            DeliveryDTO updated = deliveryService.updateDelivery(delivery);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Livraison confirmée avec succès");
            response.put("delivery", updated);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Erreur lors de la confirmation de la livraison");
            return response;
        }
    }

    /**
     * Met à jour la position du livreur
     */
    public Map<String, Object> updateDriverLocation(LocationDTO location) {
        try {
            // Ici vous pourriez sauvegarder la position en base de données
            // Pour l'instant, on simule juste une réponse positive
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Position mise à jour");
            response.put("timestamp", LocalDateTime.now());
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Erreur lors de la mise à jour de la position");
            return response;
        }
    }

    /**
     * Récupère les statistiques d'un livreur
     */
    public DriverStatsDTO getDriverStats(Long driverId) {
        // Simulation des statistiques pour la démo
        DriverStatsDTO stats = new DriverStatsDTO();
        stats.setDriverId(driverId);
        stats.setDriverName("Livreur Demo");
        stats.setTotalDeliveries(128);
        stats.setCompletedThisWeek(23);
        stats.setPendingDeliveries(5);
        stats.setAverageRating(4.8);
        stats.setTotalDistance(450);
        stats.setAverageDeliveryTime(25);
        
        // Récupérer les livraisons récentes
        List<DeliveryDTO> recentDeliveries = deliveryService.getAllDeliveries()
            .stream()
            .limit(5)
            .map(this::enrichDeliveryData)
            .toList();
        stats.setRecentDeliveries(recentDeliveries);
        
        return stats;
    }

    /**
     * Valide un QR code pour une livraison
     */
    public Map<String, Object> validateQRCode(String qrCode) {
        try {
            // Logique simple : le QR code contient l'ID de la livraison
            Long deliveryId = Long.parseLong(qrCode);
            DeliveryDTO delivery = deliveryService.getDeliveryById(deliveryId);
            
            // Mettre à jour le statut à DELIVERED
            delivery.setStatus("DELIVERED");
            DeliveryDTO updated = deliveryService.updateDelivery(delivery);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "QR Code validé avec succès");
            response.put("delivery", updated);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "QR Code invalide ou livraison introuvable");
            return response;
        }
    }

    /**
     * Génère un QR code pour une livraison
     */
    public Map<String, Object> generateQRCode(Long deliveryId) {
        try {
            DeliveryDTO delivery = deliveryService.getDeliveryById(deliveryId);
            
            // Générer un QR code simple (l'ID de la livraison)
            String qrCode = deliveryId.toString();
            delivery.setQrCode(qrCode);
            deliveryService.updateDelivery(delivery);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("qrCode", qrCode);
            response.put("deliveryId", deliveryId);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Erreur lors de la génération du QR code");
            return response;
        }
    }

    /**
     * Enrichit les données de livraison avec des informations supplémentaires
     */
    private DeliveryDTO enrichDeliveryData(DeliveryDTO delivery) {
        // Ajouter des données simulées pour la démo
        if (delivery.getClientName() == null) {
            delivery.setClientName("Client " + delivery.getId());
        }
        if (delivery.getClientPhone() == null) {
            delivery.setClientPhone("06" + String.format("%08d", delivery.getId()));
        }
        if (delivery.getCity() == null) {
            delivery.setCity("Lyon");
        }
        if (delivery.getPostalCode() == null) {
            delivery.setPostalCode("6900" + (delivery.getId() % 9 + 1));
        }
        if (delivery.getDeliveryDate() == null) {
            delivery.setDeliveryDate(LocalDateTime.now().plusDays(delivery.getId() % 7));
        }
        
        return delivery;
    }

    /**
     * Mappe les statuts du backend vers le format mobile
     */
    public String mapStatusToMobile(String backendStatus) {
        return switch (backendStatus) {
            case "PREPARING" -> "pending";
            case "SHIPPED" -> "processing";
            case "DELIVERED" -> "delivered";
            default -> "pending";
        };
    }

    /**
     * Mappe les statuts mobile vers le format backend
     */
    public String mapStatusToBackend(String mobileStatus) {
        return switch (mobileStatus) {
            case "pending" -> "PREPARING";
            case "processing" -> "SHIPPED";
            case "delivered" -> "DELIVERED";
            default -> "PREPARING";
        };
    }
} 