// NOTE: Les imports JavaFX nécessitent que le projet soit configuré avec JavaFX (via Maven/Gradle ou configuration IDE)
// Si vous voyez des erreurs ici, ajoutez les dépendances JavaFX à votre projet.
package com.magnii.minotordesktop;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/MainView.fxml"));
        Parent root = loader.load();
        primaryStage.setTitle("Minot'Or Desktop Analytics");
        primaryStage.setScene(new Scene(root, 1000, 700));
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
} 