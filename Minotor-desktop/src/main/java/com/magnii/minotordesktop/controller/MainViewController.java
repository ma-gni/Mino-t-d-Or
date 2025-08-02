package com.magnii.minotordesktop.controller;

import java.io.File;
import java.io.FileWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.json.JSONArray;
import org.json.JSONObject;

import com.magnii.minotordesktop.model.AnalyticsDto;
import com.magnii.minotordesktop.model.AuthResponse;
import com.magnii.minotordesktop.model.OrderDto;
import com.magnii.minotordesktop.model.PageVisitDto;
import com.magnii.minotordesktop.model.ProductDto;
import com.magnii.minotordesktop.model.StockDto;
import com.magnii.minotordesktop.model.UserDto;
import com.magnii.minotordesktop.service.ApiService;

import javafx.animation.FadeTransition;
import javafx.animation.ScaleTransition;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.print.PrinterJob;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.chart.BarChart;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ComboBox;
import javafx.scene.control.DatePicker;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressIndicator;
import javafx.scene.control.SelectionMode;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.StackPane;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import javafx.util.Duration;

public class MainViewController {
    @FXML private TableView<PageVisitDto> pageVisitTable;
    @FXML private TableColumn<PageVisitDto, String> pageNameColumn;
    @FXML private TableColumn<PageVisitDto, String> visitDateTimeColumn;
    @FXML private TableColumn<PageVisitDto, String> visitorIdColumn;
    @FXML private TextField searchField;
    @FXML private TextField visitorSearchField;
    @FXML private DatePicker startDatePicker;
    @FXML private DatePicker endDatePicker;
    @FXML private ComboBox<String> groupByComboBox;
    @FXML private ProgressIndicator loader;
    @FXML private Button prevPageButton;
    @FXML private Button nextPageButton;
    @FXML private Label pageLabel;
    @FXML private BarChart<String, Number> barChart;
    @FXML private CategoryAxis xAxis;
    @FXML private NumberAxis yAxis;
    private int currentPage = 1;
    private final int pageSize = 20;
    private final DateTimeFormatter dtf = DateTimeFormatter.ISO_DATE_TIME;

    private final ApiService apiService = new ApiService("http://localhost:8081/api/");
    private AuthResponse currentUser;

    private ObservableList<PageVisitDto> allVisits = FXCollections.observableArrayList();
    private FilteredList<PageVisitDto> filteredVisits = new FilteredList<>(allVisits, p -> true);
    private ObservableList<PageVisitDto> groupedVisits = FXCollections.observableArrayList();
    private boolean isGrouped = false;
    private final Label emptyLabel = new Label("Aucune donnée à afficher");
    private boolean darkTheme = false;
    @FXML private Button themeToggleButton;
    @FXML private StackPane rootPane;

    public void setCurrentUser(AuthResponse user) {
        this.currentUser = user;
        if (user != null && user.getToken() != null) {
            apiService.setAuthToken(user.getToken());
        }
    }

    public void show() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/MainView.fxml"));
            Parent root = loader.load();
            
            Stage stage = new Stage();
            stage.setTitle("Minot'Or Desktop Analytics - " + (currentUser != null ? currentUser.getUsername() : ""));
            stage.setScene(new Scene(root, 1000, 700));
            stage.show();
            
            // Charger les données depuis l'API
            loadDataFromApi();
        } catch (Exception e) {
            showError("Erreur lors de l'ouverture de l'application : " + e.getMessage());
        }
    }

    @FXML
    public void initialize() {
        // Configuration de base
        pageNameColumn.setCellValueFactory(new PropertyValueFactory<>("pageName"));
        visitDateTimeColumn.setCellValueFactory(new PropertyValueFactory<>("visitDateTime"));
        visitorIdColumn.setCellValueFactory(new PropertyValueFactory<>("visitorId"));
        pageVisitTable.setPlaceholder(emptyLabel);
        pageVisitTable.getSelectionModel().setSelectionMode(SelectionMode.MULTIPLE);
        groupByComboBox.setItems(FXCollections.observableArrayList(
            "Aucun regroupement", "Par page", "Par jour"
        ));
        
        // Appliquer le thème cinématique par défaut
        String cinematicCss = getClass().getResource("/cinematic-theme.css").toExternalForm();
        System.out.println("🎨 CSS cinématique : " + cinematicCss);
        
        // Attendre que la scène soit disponible
        Platform.runLater(() -> {
            if (rootPane.getScene() != null) {
                rootPane.getScene().getStylesheets().clear();
                rootPane.getScene().getStylesheets().add(cinematicCss);
                System.out.println("✅ CSS appliqué avec succès");
            } else {
                System.err.println("❌ Scène non disponible pour appliquer le CSS");
            }
        });
        
        // Animation d'entrée pour les éléments
        animateElements();
        
        // Charger les données et forcer l'affichage
        loadPageVisits();
        
        // Forcer la mise à jour du tableau après un délai
        Platform.runLater(() -> {
            pageVisitTable.setItems(filteredVisits);
            System.out.println("🎯 Tableau mis à jour avec " + filteredVisits.size() + " éléments");
            
            // Si pas de données, ajouter des données de test
            if (filteredVisits.isEmpty()) {
                System.out.println("⚠️ Aucune donnée, ajout de données de test...");
                addTestData();
            }
            
            updateBarChart();
        });
    }
    
    private void animateElements() {
        // Animation d'entrée pour le tableau
        FadeTransition tableFade = new FadeTransition(Duration.millis(800), pageVisitTable);
        tableFade.setFromValue(0);
        tableFade.setToValue(1);
        tableFade.setDelay(Duration.millis(200));
        tableFade.play();
        
        // Animation d'entrée pour les boutons
        FadeTransition buttonFade = new FadeTransition(Duration.millis(600), themeToggleButton);
        buttonFade.setFromValue(0);
        buttonFade.setToValue(1);
        buttonFade.setDelay(Duration.millis(400));
        buttonFade.play();
        
        // Animation de scale pour le graphique
        ScaleTransition chartScale = new ScaleTransition(Duration.millis(500), barChart);
        chartScale.setFromX(0.8);
        chartScale.setFromY(0.8);
        chartScale.setToX(1.0);
        chartScale.setToY(1.0);
        chartScale.setDelay(Duration.millis(600));
        chartScale.play();
    }

    private void loadDataFromApi() {
        loader.setVisible(true);
        
        try {
            // Charger les analytics
            List<AnalyticsDto> analytics = apiService.getAnalytics();
            updateAnalyticsDisplay(analytics);
            
            // Charger les commandes
            List<OrderDto> orders = apiService.getOrders();
            updateOrdersDisplay(orders);
            
            // Charger les produits
            List<ProductDto> products = apiService.getProducts();
            updateProductsDisplay(products);
            
            // Charger les utilisateurs
            List<UserDto> users = apiService.getUsers();
            updateUsersDisplay(users);
            
            // Charger les stocks
            List<StockDto> stocks = apiService.getStocks();
            updateStocksDisplay(stocks);
            
        } catch (Exception e) {
            showError("Erreur lors du chargement des données :\n" + e.getMessage());
            e.printStackTrace();
        } finally {
            loader.setVisible(false);
        }
    }

    private void updateAnalyticsDisplay(List<AnalyticsDto> analytics) {
        // Mettre à jour l'affichage des analytics
        System.out.println("Analytics chargées : " + analytics.size());
    }

    private void updateOrdersDisplay(List<OrderDto> orders) {
        // Mettre à jour l'affichage des commandes
        System.out.println("Commandes chargées : " + orders.size());
    }

    private void updateProductsDisplay(List<ProductDto> products) {
        // Mettre à jour l'affichage des produits
        System.out.println("Produits chargés : " + products.size());
    }

    private void updateUsersDisplay(List<UserDto> users) {
        // Mettre à jour l'affichage des utilisateurs
        System.out.println("Utilisateurs chargés : " + users.size());
    }

    private void updateStocksDisplay(List<StockDto> stocks) {
        // Mettre à jour l'affichage des stocks
        System.out.println("Stocks chargés : " + stocks.size());
    }

    private void loadPageVisits() {
        loader.setVisible(true);
        try {
            System.out.println("🔄 Chargement des page-visits...");
            String json = apiService.get("page-visits"); // Adapter l'endpoint à ton API
            System.out.println("📡 Réponse API : " + json);
            List<PageVisitDto> visits = parseVisits(json);
            System.out.println("📊 Visites parsées : " + visits.size());
            allVisits.setAll(visits);
            System.out.println("✅ Données chargées dans allVisits : " + allVisits.size());
            System.out.println("📋 filteredVisits size : " + filteredVisits.size());
        } catch (Exception e) {
            System.err.println("❌ Erreur lors du chargement des données : " + e.getMessage());
            showError("Erreur lors du chargement des données :\n" + e.getMessage());
            e.printStackTrace();
        } finally {
            loader.setVisible(false);
        }
    }

    private List<PageVisitDto> parseVisits(String json) {
        List<PageVisitDto> visits = new ArrayList<>();
        try {
            JSONArray arr = new JSONArray(json);
            System.out.println("📋 JSON Array length : " + arr.length());
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                PageVisitDto dto = new PageVisitDto();
                dto.setPageName(obj.optString("pageName"));
                dto.setVisitDateTime(obj.optString("visitDateTime"));
                dto.setVisitorId(obj.optString("visitorId"));
                visits.add(dto);
                System.out.println("📄 Parsé : " + dto.getPageName() + " - " + dto.getVisitDateTime());
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur parsing JSON : " + e.getMessage());
            e.printStackTrace();
        }
        return visits;
    }

    private void addTestData() {
        try {
            PageVisitDto test1 = new PageVisitDto();
            test1.setPageName("Accueil");
            test1.setVisitDateTime("2025-07-31T10:00:00");
            test1.setVisitorId("test_001");
            
            PageVisitDto test2 = new PageVisitDto();
            test2.setPageName("Produits");
            test2.setVisitDateTime("2025-07-31T10:30:00");
            test2.setVisitorId("test_002");
            
            PageVisitDto test3 = new PageVisitDto();
            test3.setPageName("Contact");
            test3.setVisitDateTime("2025-07-31T11:00:00");
            test3.setVisitorId("test_003");
            
            allVisits.addAll(test1, test2, test3);
            System.out.println("✅ Données de test ajoutées : " + allVisits.size() + " éléments");
            
        } catch (Exception e) {
            System.err.println("❌ Erreur ajout données test : " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void showError(String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Erreur");
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    @FXML
    private void onRefresh() {
        loadPageVisits();
    }

    private void updatePagination() {
        ObservableList<PageVisitDto> source = isGrouped ? groupedVisits : filteredVisits;
        int totalItems = source.size();
        int totalPages = (int) Math.ceil((double) totalItems / pageSize);
        if (currentPage > totalPages) currentPage = totalPages == 0 ? 1 : totalPages;
        int fromIndex = (currentPage - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, totalItems);
        ObservableList<PageVisitDto> pageItems = FXCollections.observableArrayList();
        if (fromIndex < toIndex && fromIndex >= 0) {
            pageItems.addAll(source.subList(fromIndex, toIndex));
        }
        pageVisitTable.setItems(pageItems);
        pageLabel.setText("Page " + currentPage + "/" + (totalPages == 0 ? 1 : totalPages));
        prevPageButton.setDisable(currentPage <= 1);
        nextPageButton.setDisable(currentPage >= totalPages);
    }

    @FXML
    private void onPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    }

    @FXML
    private void onNextPage() {
        ObservableList<PageVisitDto> source = isGrouped ? groupedVisits : filteredVisits;
        int totalPages = (int) Math.ceil((double) source.size() / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    }

    private void updateBarChart() {
        barChart.getData().clear();
        Map<String, Long> countByPage = filteredVisits.stream()
            .collect(Collectors.groupingBy(PageVisitDto::getPageName, Collectors.counting()));
        XYChart.Series<String, Number> series = new XYChart.Series<>();
        for (Map.Entry<String, Long> entry : countByPage.entrySet()) {
            series.getData().add(new XYChart.Data<>(entry.getKey(), entry.getValue()));
        }
        barChart.getData().add(series);
    }

    // Appeler updatePagination à chaque changement de filtre ou de regroupement
    @FXML
    private void onGroupBy() {
        String selected = groupByComboBox.getValue();
        if (selected == null || selected.equals("Aucun regroupement")) {
            isGrouped = false;
            pageVisitTable.setItems(filteredVisits);
        } else if (selected.equals("Par page")) {
            isGrouped = true;
            Map<String, Long> countByPage = filteredVisits.stream()
                .collect(Collectors.groupingBy(PageVisitDto::getPageName, Collectors.counting()));
            groupedVisits.setAll(countByPage.entrySet().stream()
                .map(e -> {
                    PageVisitDto dto = new PageVisitDto();
                    dto.setPageName(e.getKey());
                    dto.setVisitDateTime("Total: " + e.getValue());
                    dto.setVisitorId("");
                    return dto;
                })
                .collect(Collectors.toList()));
            pageVisitTable.setItems(groupedVisits);
        } else if (selected.equals("Par jour")) {
            isGrouped = true;
            Map<String, Long> countByDay = filteredVisits.stream()
                .collect(Collectors.groupingBy(v -> v.getVisitDateTime().substring(0, 10), Collectors.counting()));
            groupedVisits.setAll(countByDay.entrySet().stream()
                .map(e -> {
                    PageVisitDto dto = new PageVisitDto();
                    dto.setPageName("");
                    dto.setVisitDateTime(e.getKey());
                    dto.setVisitorId("Total: " + e.getValue());
                    return dto;
                })
                .collect(Collectors.toList()));
            pageVisitTable.setItems(groupedVisits);
        }
        updatePagination();
        updateBarChart();
    }

    // Appeler onGroupBy à chaque changement de filtre pour garder la synthèse à jour
    @FXML
    private void onDateFilter() {
        LocalDate start = startDatePicker.getValue();
        LocalDate end = endDatePicker.getValue();
        String visitorFilter = visitorSearchField.getText();
        filteredVisits.setPredicate(p -> {
            boolean matches = true;
            if (start != null) {
                try {
                    LocalDateTime visit = LocalDateTime.parse(p.getVisitDateTime(), dtf);
                    matches = matches && !visit.toLocalDate().isBefore(start);
                } catch (Exception ignored) {}
            }
            if (end != null) {
                try {
                    LocalDateTime visit = LocalDateTime.parse(p.getVisitDateTime(), dtf);
                    matches = matches && !visit.toLocalDate().isAfter(end);
                } catch (Exception ignored) {}
            }
            // Filtre texte page
            String filter = searchField.getText();
            if (filter != null && !filter.isEmpty()) {
                String lower = filter.toLowerCase();
                matches = matches && p.getPageName() != null && p.getPageName().toLowerCase().contains(lower);
            }
            // Filtre visiteur
            if (visitorFilter != null && !visitorFilter.isEmpty()) {
                String lower = visitorFilter.toLowerCase();
                matches = matches && p.getVisitorId() != null && p.getVisitorId().toLowerCase().contains(lower);
            }
            return matches;
        });
        onGroupBy();
        updateBarChart();
    }

    @FXML
    private void onSearch() {
        onDateFilter(); // Combine recherche texte et date
        onGroupBy();
        updatePagination();
        updateBarChart();
    }

    @FXML
    private void onExportCsv() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Enregistrer sous");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV Files", "*.csv"));
        File file = fileChooser.showSaveDialog(pageVisitTable.getScene().getWindow());
        if (file != null) {
            try (FileWriter writer = new FileWriter(file)) {
                writer.write("Page,Date/Heure,Visiteur\n");
                for (PageVisitDto dto : pageVisitTable.getItems()) {
                    writer.write(String.format("%s,%s,%s\n",
                        escapeCsv(dto.getPageName()),
                        escapeCsv(dto.getVisitDateTime()),
                        escapeCsv(dto.getVisitorId())));
                }
            } catch (Exception e) {
                showError("Erreur lors de l'export CSV :\n" + e.getMessage());
            }
        }
    }

    @FXML
    private void onExportSelectedCsv() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Enregistrer la sélection sous");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("CSV Files", "*.csv"));
        File file = fileChooser.showSaveDialog(pageVisitTable.getScene().getWindow());
        if (file != null) {
            try (FileWriter writer = new FileWriter(file)) {
                writer.write("Page,Date/Heure,Visiteur\n");
                for (PageVisitDto dto : pageVisitTable.getSelectionModel().getSelectedItems()) {
                    writer.write(String.format("%s,%s,%s\n",
                        escapeCsv(dto.getPageName()),
                        escapeCsv(dto.getVisitDateTime()),
                        escapeCsv(dto.getVisitorId())));
                }
            } catch (Exception e) {
                showError("Erreur lors de l'export CSV sélection :\n" + e.getMessage());
            }
        }
    }

    @FXML
    private void onExportPdf() {
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Exporter en PDF");
        fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("PDF Files", "*.pdf"));
        File file = fileChooser.showSaveDialog(pageVisitTable.getScene().getWindow());
        if (file != null) {
            try (PDDocument doc = new PDDocument()) {
                PDPage page = new PDPage(PDRectangle.A4);
                doc.addPage(page);
                PDPageContentStream content = new PDPageContentStream(doc, page);
                content.setFont(PDType1Font.HELVETICA_BOLD, 14);
                content.beginText();
                content.newLineAtOffset(50, 800);
                content.showText("Page, Date/Heure, Visiteur");
                content.endText();
                content.setFont(PDType1Font.HELVETICA, 12);
                int y = 780;
                for (PageVisitDto dto : pageVisitTable.getItems()) {
                    if (y < 60) {
                        content.close();
                        page = new PDPage(PDRectangle.A4);
                        doc.addPage(page);
                        content = new PDPageContentStream(doc, page);
                        y = 800;
                    }
                    content.beginText();
                    content.newLineAtOffset(50, y);
                    content.showText(String.format("%s, %s, %s",
                        safePdf(dto.getPageName()),
                        safePdf(dto.getVisitDateTime()),
                        safePdf(dto.getVisitorId())));
                    content.endText();
                    y -= 18;
                }
                content.close();
                doc.save(file);
            } catch (Exception e) {
                showError("Erreur lors de l'export PDF :\n" + e.getMessage());
            }
        }
    }

    @FXML
    private void onResetFilters() {
        searchField.clear();
        visitorSearchField.clear();
        startDatePicker.setValue(null);
        endDatePicker.setValue(null);
        filteredVisits.setPredicate(p -> true);
        onGroupBy();
        updatePagination();
        updateBarChart();
    }

    @FXML
    private void onToggleTheme() {
        darkTheme = !darkTheme;
        String cinematicCss = getClass().getResource("/cinematic-theme.css").toExternalForm();
        
        if (themeToggleButton.getScene() != null) {
            themeToggleButton.getScene().getStylesheets().clear();
            themeToggleButton.getScene().getStylesheets().add(cinematicCss);
        }
        
        if (darkTheme) {
            themeToggleButton.setText("☀️");
            rootPane.getStyleClass().add("dark-theme");
        } else {
            themeToggleButton.setText("🌙");
            rootPane.getStyleClass().remove("dark-theme");
        }
        
        // Animation de transition
        FadeTransition fadeTransition = new FadeTransition(Duration.millis(300), rootPane);
        fadeTransition.setFromValue(0.8);
        fadeTransition.setToValue(1.0);
        fadeTransition.play();
    }

    @FXML
    private void onPrint() {
        PrinterJob job = PrinterJob.createPrinterJob();
        if (job != null && job.showPrintDialog(pageVisitTable.getScene().getWindow())) {
            boolean success = job.printPage(pageVisitTable);
            if (success) {
                job.endJob();
            }
        }
    }

    @FXML
    private void onPrintChart() {
        PrinterJob job = PrinterJob.createPrinterJob();
        if (job != null && job.showPrintDialog(barChart.getScene().getWindow())) {
            boolean success = job.printPage(barChart);
            if (success) {
                job.endJob();
            }
        }
    }

    @FXML
    private void onDeleteSelected() {
        var selected = pageVisitTable.getSelectionModel().getSelectedItems();
        if (selected.isEmpty()) {
            showSnackbar("Aucune ligne sélectionnée.");
            return;
        }
        // Animation de fondu pour chaque ligne sélectionnée
        for (PageVisitDto dto : selected) {
            FadeTransition ft = new FadeTransition(Duration.millis(400), pageVisitTable);
            ft.setFromValue(1.0);
            ft.setToValue(0.3);
            ft.setAutoReverse(true);
            ft.setCycleCount(2);
            ft.setOnFinished(e -> {
                allVisits.remove(dto);
                updatePagination();
                updateBarChart();
                showSnackbar("Ligne supprimée.");
            });
            ft.play();
        }
    }

    private void showSnackbar(String message) {
        Label snackbar = new Label(message);
        snackbar.setStyle("-fx-background-color: #323232; -fx-text-fill: white; -fx-padding: 10px; -fx-background-radius: 5px;");
        snackbar.setOpacity(0);
        rootPane.getChildren().add(snackbar);
        FadeTransition fadeIn = new FadeTransition(Duration.millis(300), snackbar);
        fadeIn.setFromValue(0);
        fadeIn.setToValue(1);
        fadeIn.setOnFinished(e -> {
            FadeTransition fadeOut = new FadeTransition(Duration.millis(1200), snackbar);
            fadeOut.setFromValue(1);
            fadeOut.setToValue(0);
            fadeOut.setDelay(Duration.millis(1000));
            fadeOut.setOnFinished(ev -> rootPane.getChildren().remove(snackbar));
            fadeOut.play();
        });
        fadeIn.play();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            value = value.replace("\"", "\"\"");
            return '"' + value + '"';
        }
        return value;
    }

    private String safePdf(String value) {
        if (value == null) return "";
        return value.replace("\n", " ").replace("\r", " ");
    }
} 