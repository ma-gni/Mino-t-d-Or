package com.magnii.minotor.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.security.core.token.TokenService;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final TokenService tokenService;

    public NotificationService(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    public void sendLoginNotification(String deviceToken, String username) {
        Notification notification = Notification.builder()
                .setTitle("Login Success")
                .setBody("Welcome back, " + username )
                .build();

        Message message = Message.builder()
                .setToken(deviceToken)
                .setNotification(notification)
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Notification sent successfully: " + response);
        } catch (Exception e) {
            System.err.println("Error sending notification: " + e.getMessage());
        }
    }

}