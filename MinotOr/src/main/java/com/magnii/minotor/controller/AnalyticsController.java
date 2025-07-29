package com.magnii.minotor.controller;

import com.magnii.minotor.dto.AnalyticsDTO;
import com.magnii.minotor.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<List<AnalyticsDTO>> getAnalytics() {
        List<AnalyticsDTO> analytics = analyticsService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<AnalyticsDTO>> getOrderAnalytics() {
        List<AnalyticsDTO> analytics = analyticsService.getOrderAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/products")
    public ResponseEntity<List<AnalyticsDTO>> getProductAnalytics() {
        List<AnalyticsDTO> analytics = analyticsService.getProductAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/users")
    public ResponseEntity<List<AnalyticsDTO>> getUserAnalytics() {
        List<AnalyticsDTO> analytics = analyticsService.getUserAnalytics();
        return ResponseEntity.ok(analytics);
    }
} 