package com.magnii.minotor.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
@ConditionalOnProperty(name = "firebase.enabled", havingValue = "true", matchIfMissing = false)
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    private final Resource credentials;

    // Accepts classpath: or file: (or any Spring Resource) via firebase.credentials
    public FirebaseConfig(
            @Value("${firebase.credentials:classpath:firebase-service-account.json}") Resource credentials
    ) {
        this.credentials = credentials;
    }

    @PostConstruct
    public void init() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            log.debug("FirebaseApp already initialized; skipping.");
            return;
        }

        GoogleCredentials creds;
        if (credentials.exists()) {
            try (InputStream in = credentials.getInputStream()) {
                creds = GoogleCredentials.fromStream(in);
                log.info("Initializing Firebase using credentials from {}", credentials);
            }
        } else {
            // Optional: fall back to ADC if you run on GCP with env/metadata credentials
            log.warn("Firebase credentials '{}' not found. Falling back to Application Default Credentials.", credentials);
            creds = GoogleCredentials.getApplicationDefault();
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(creds)
                .build();

        FirebaseApp.initializeApp(options);
        log.info("FirebaseApp initialized.");
    }
}