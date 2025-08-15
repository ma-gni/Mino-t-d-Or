package com.magnii.minotor.config;

import com.magnii.minotor.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Allow login and registration
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/test-user").permitAll()

                        // Allow activation via ID path
                        .requestMatchers(HttpMethod.PUT, "/api/auth/users/**").permitAll()

                        // Swagger access
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // Health check endpoint
                        .requestMatchers("/actuator/health", "/api/health", "/health").permitAll()

                        // Desktop app endpoints (temporarily allow without auth for testing)
                        .requestMatchers("/api/analytics", "/api/orders", "/api/products", 
                                       "/api/users", "/api/stocks", "/api/page-visits", "/api/roles").permitAll()

                        // Mobile app endpoints (temporarily allow without auth for testing)
                        .requestMatchers("/api/deliveries", "/api/deliveries/**", 
                                       "/api/mobile/**").permitAll()

                        // Everything else requires auth
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}