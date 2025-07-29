package com.magnii.minotor.service;

import com.magnii.minotor.dto.AnalyticsDTO;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.ProductRepository;
import com.magnii.minotor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<AnalyticsDTO> getAnalytics() {
        List<AnalyticsDTO> analytics = new ArrayList<>();
        
        // Ajouter des métriques de base
        analytics.add(new AnalyticsDTO("Total Orders", orderRepository.count(), LocalDate.now().toString()));
        analytics.add(new AnalyticsDTO("Total Products", productRepository.count(), LocalDate.now().toString()));
        analytics.add(new AnalyticsDTO("Total Users", userRepository.count(), LocalDate.now().toString()));
        
        return analytics;
    }

    public List<AnalyticsDTO> getOrderAnalytics() {
        List<AnalyticsDTO> analytics = new ArrayList<>();
        
        // Statistiques des commandes
        long totalOrders = orderRepository.count();
        
        analytics.add(new AnalyticsDTO("Total Orders", totalOrders, LocalDate.now().toString()));
        
        return analytics;
    }

    public List<AnalyticsDTO> getProductAnalytics() {
        List<AnalyticsDTO> analytics = new ArrayList<>();
        
        // Statistiques des produits
        long totalProducts = productRepository.count();
        
        analytics.add(new AnalyticsDTO("Total Products", totalProducts, LocalDate.now().toString()));
        
        return analytics;
    }

    public List<AnalyticsDTO> getUserAnalytics() {
        List<AnalyticsDTO> analytics = new ArrayList<>();
        
        // Statistiques des utilisateurs
        long totalUsers = userRepository.count();
        
        analytics.add(new AnalyticsDTO("Total Users", totalUsers, LocalDate.now().toString()));
        
        return analytics;
    }
} 