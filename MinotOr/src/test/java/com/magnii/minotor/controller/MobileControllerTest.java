package com.magnii.minotor.controller;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.dto.DriverStatsDTO;
import com.magnii.minotor.dto.LocationDTO;
import com.magnii.minotor.service.MobileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MobileController.class)
public class MobileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MobileService mobileService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetActiveDeliveriesForDriver() throws Exception {
        // Préparer les données de test
        DeliveryDTO delivery = new DeliveryDTO();
        delivery.setId(1L);
        delivery.setStatus("processing");
        delivery.setAddress("123 Rue de Test");
        delivery.setClientName("Client Test");
        
        when(mobileService.getActiveDeliveriesForDriver())
            .thenReturn(List.of(delivery));

        // Exécuter le test
        mockMvc.perform(get("/api/mobile/deliveries/active"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].status").value("processing"))
            .andExpect(jsonPath("$[0].address").value("123 Rue de Test"))
            .andExpect(jsonPath("$[0].clientName").value("Client Test"));
    }

    @Test
    public void testConfirmDelivery() throws Exception {
        // Préparer les données de test
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Livraison confirmée avec succès");
        
        DeliveryDTO delivery = new DeliveryDTO();
        delivery.setId(1L);
        delivery.setStatus("delivered");
        response.put("delivery", delivery);
        
        when(mobileService.confirmDelivery(1L)).thenReturn(response);

        // Exécuter le test
        mockMvc.perform(post("/api/mobile/deliveries/1/confirm"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Livraison confirmée avec succès"));
    }

    @Test
    public void testUpdateDriverLocation() throws Exception {
        // Préparer les données de test
        LocationDTO location = new LocationDTO();
        location.setDriverId(1L);
        location.setLatitude(45.7640);
        location.setLongitude(4.8357);
        location.setTimestamp(LocalDateTime.now());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Position mise à jour");
        
        when(mobileService.updateDriverLocation(any(LocationDTO.class))).thenReturn(response);

        // Exécuter le test
        mockMvc.perform(post("/api/mobile/location/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(location)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Position mise à jour"));
    }

    @Test
    public void testGetDriverStats() throws Exception {
        // Préparer les données de test
        DriverStatsDTO stats = new DriverStatsDTO();
        stats.setDriverId(1L);
        stats.setDriverName("Livreur Test");
        stats.setTotalDeliveries(100);
        stats.setCompletedThisWeek(20);
        stats.setPendingDeliveries(5);
        stats.setAverageRating(4.5);
        
        when(mobileService.getDriverStats(1L)).thenReturn(stats);

        // Exécuter le test
        mockMvc.perform(get("/api/mobile/stats/driver/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.driverId").value(1))
            .andExpect(jsonPath("$.driverName").value("Livreur Test"))
            .andExpect(jsonPath("$.totalDeliveries").value(100))
            .andExpect(jsonPath("$.completedThisWeek").value(20))
            .andExpect(jsonPath("$.pendingDeliveries").value(5))
            .andExpect(jsonPath("$.averageRating").value(4.5));
    }

    @Test
    public void testScanQRCode() throws Exception {
        // Préparer les données de test
        Map<String, String> request = new HashMap<>();
        request.put("qrCode", "12345");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "QR Code validé avec succès");
        
        when(mobileService.validateQRCode("12345")).thenReturn(response);

        // Exécuter le test
        mockMvc.perform(post("/api/mobile/qr/scan")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("QR Code validé avec succès"));
    }

    @Test
    public void testGenerateQRCode() throws Exception {
        // Préparer les données de test
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("qrCode", "12345");
        response.put("deliveryId", 12345L);
        
        when(mobileService.generateQRCode(12345L)).thenReturn(response);

        // Exécuter le test
        mockMvc.perform(post("/api/mobile/qr/generate/12345"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.qrCode").value("12345"))
            .andExpect(jsonPath("$.deliveryId").value(12345));
    }

    @Test
    public void testConfirmDeliveryError() throws Exception {
        // Préparer les données de test pour une erreur
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", "Erreur lors de la confirmation de la livraison");
        
        when(mobileService.confirmDelivery(999L)).thenReturn(response);

        // Exécuter le test
        mockMvc.perform(post("/api/mobile/deliveries/999/confirm"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error").value("Erreur lors de la confirmation de la livraison"));
    }
} 