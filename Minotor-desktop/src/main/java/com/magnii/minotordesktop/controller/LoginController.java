package com.magnii.minotordesktop.controller;

import com.magnii.minotordesktop.model.AuthResponse;
import com.magnii.minotordesktop.service.ApiService;

import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

public class LoginController {
    @FXML private TextField usernameField;
    @FXML private PasswordField passwordField;
    @FXML private Button loginButton;
    
    private final ApiService apiService = new ApiService("http://localhost:8081/api/");
    private AuthResponse currentUser;

    @FXML
    public void initialize() {
        loginButton.setOnAction(e -> handleLogin());
    }

    private void handleLogin() {
        String username = usernameField.getText();
        String password = passwordField.getText();

        if (username.isEmpty() || password.isEmpty()) {
            showError("Veuillez remplir tous les champs");
            return;
        }

        try {
            currentUser = apiService.login(username, password);
            showSuccess("Connexion réussie ! Bienvenue " + currentUser.getUsername());
            
            // Ouvrir la fenêtre principale
            openMainWindow();
            
        } catch (Exception e) {
            showError("Erreur de connexion : " + e.getMessage());
        }
    }

    private void openMainWindow() {
        try {
            // Fermer la fenêtre de connexion
            Stage currentStage = (Stage) loginButton.getScene().getWindow();
            currentStage.close();
            
            // Ouvrir la fenêtre principale avec les données utilisateur
            MainViewController mainController = new MainViewController();
            mainController.setCurrentUser(currentUser);
            mainController.show();
            
        } catch (Exception e) {
            showError("Erreur lors de l'ouverture de l'application : " + e.getMessage());
        }
    }

    private void showError(String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Erreur");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private void showSuccess(String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Succès");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    public AuthResponse getCurrentUser() {
        return currentUser;
    }
} 