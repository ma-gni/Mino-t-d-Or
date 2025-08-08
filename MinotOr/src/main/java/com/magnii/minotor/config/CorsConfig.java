package com.magnii.minotor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Autoriser les origines spécifiques pour le développement
        List<String> allowedOrigins = Arrays.asList(
            "http://localhost:8082",      // Application mobile (Expo)
            "http://localhost:8083",      // Application mobile (Expo alternatif)
            "http://localhost:3000",      // React dev server
            "http://localhost:5173",      // Vite dev server
            "http://localhost:5177",      // Vite dev server alternatif
            "http://192.168.1.100:8082", // Device mobile
            "http://192.168.1.100:8083", // Device mobile alternatif
            "http://10.0.2.2:8082",      // Android Emulator
            "http://10.0.2.2:8083",      // Android Emulator alternatif
            "http://127.0.0.1:8082",     // Localhost alternatif
            "http://127.0.0.1:8083",     // Localhost alternatif
            "http://localhost:8081",      // Backend lui-même
            "https://minotor.fr"          // Production
        );
        configuration.setAllowedOrigins(allowedOrigins);
        
        // Autoriser toutes les méthodes HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Autoriser tous les headers
        configuration.setAllowedHeaders(Arrays.asList(
            "*",
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Autoriser les credentials
        configuration.setAllowCredentials(true);
        
        // Exposer les headers de réponse
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        
        // Configuration pour les requêtes preflight
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        source.registerCorsConfiguration("/actuator/**", configuration);
        
        return source;
    }
} 