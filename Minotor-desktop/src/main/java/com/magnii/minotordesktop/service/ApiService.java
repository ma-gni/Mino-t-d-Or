package com.magnii.minotordesktop.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.magnii.minotordesktop.model.AnalyticsDto;
import com.magnii.minotordesktop.model.AuthResponse;
import com.magnii.minotordesktop.model.OrderDto;
import com.magnii.minotordesktop.model.PageVisitDto;
import com.magnii.minotordesktop.model.ProductDto;
import com.magnii.minotordesktop.model.StockDto;
import com.magnii.minotordesktop.model.UserDto;

public class ApiService {
    private final String baseUrl;
    private String authToken;

    public ApiService(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public void setAuthToken(String token) {
        this.authToken = token;
    }

    private HttpURLConnection createConnection(String endpoint, String method) throws Exception {
        URL url = new URL(baseUrl + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod(method);
        conn.setRequestProperty("Accept", "application/json");
        conn.setRequestProperty("Content-Type", "application/json");
        
        if (authToken != null && !authToken.isEmpty()) {
            conn.setRequestProperty("Authorization", "Bearer " + authToken);
        }
        
        return conn;
    }

    public String get(String endpoint) throws Exception {
        HttpURLConnection conn = createConnection(endpoint, "GET");
        
        if (conn.getResponseCode() != 200) {
            throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
        }

        return readResponse(conn);
    }

    public String post(String endpoint, String jsonData) throws Exception {
        HttpURLConnection conn = createConnection(endpoint, "POST");
        conn.setDoOutput(true);
        
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonData.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        if (conn.getResponseCode() != 200 && conn.getResponseCode() != 201) {
            throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
        }

        return readResponse(conn);
    }

    public String put(String endpoint, String jsonData) throws Exception {
        HttpURLConnection conn = createConnection(endpoint, "PUT");
        conn.setDoOutput(true);
        
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonData.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        if (conn.getResponseCode() != 200 && conn.getResponseCode() != 204) {
            throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
        }

        return readResponse(conn);
    }

    public String delete(String endpoint) throws Exception {
        HttpURLConnection conn = createConnection(endpoint, "DELETE");
        
        if (conn.getResponseCode() != 200 && conn.getResponseCode() != 204) {
            throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
        }

        return readResponse(conn);
    }

    private String readResponse(HttpURLConnection conn) throws Exception {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            StringBuilder sb = new StringBuilder();
            String output;
            while ((output = br.readLine()) != null) {
                sb.append(output);
            }
            return sb.toString();
        }
    }

    // ===== MÉTHODES SPÉCIFIQUES POUR L'API MINOTOR =====

    // Authentification
    public AuthResponse login(String username, String password) throws Exception {
        JSONObject loginData = new JSONObject();
        loginData.put("username", username);
        loginData.put("password", password);
        
        String response = post("auth/login", loginData.toString());
        JSONObject jsonResponse = new JSONObject(response);
        
        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken(jsonResponse.getString("token"));
        authResponse.setUsername(jsonResponse.getString("username"));
        authResponse.setRole(jsonResponse.getString("role"));
        
        setAuthToken(authResponse.getToken());
        return authResponse;
    }

    // Récupération des analytics
    public List<AnalyticsDto> getAnalytics() throws Exception {
        String response = get("analytics");
        return parseAnalytics(response);
    }

    // Récupération des commandes
    public List<OrderDto> getOrders() throws Exception {
        String response = get("orders");
        return parseOrders(response);
    }

    // Récupération des produits
    public List<ProductDto> getProducts() throws Exception {
        String response = get("products");
        return parseProducts(response);
    }

    // Récupération des utilisateurs
    public List<UserDto> getUsers() throws Exception {
        String response = get("users");
        return parseUsers(response);
    }

    // Récupération des stocks
    public List<StockDto> getStocks() throws Exception {
        String response = get("stocks");
        return parseStocks(response);
    }

    // Récupération des visites de pages (pour compatibilité)
    public List<PageVisitDto> getPageVisits() throws Exception {
        String response = get("page-visits");
        return parseVisits(response);
    }

    // ===== MÉTHODES DE PARSING =====

    private List<AnalyticsDto> parseAnalytics(String json) {
        List<AnalyticsDto> analytics = new ArrayList<>();
        JSONArray arr = new JSONArray(json);
        
        for (int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);
            AnalyticsDto dto = new AnalyticsDto();
            dto.setMetric(obj.optString("metric"));
            dto.setValue(obj.optDouble("value"));
            dto.setDate(obj.optString("date"));
            analytics.add(dto);
        }
        
        return analytics;
    }

    private List<OrderDto> parseOrders(String json) {
        List<OrderDto> orders = new ArrayList<>();
        JSONArray arr = new JSONArray(json);
        
        for (int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);
            OrderDto dto = new OrderDto();
            dto.setId(obj.optLong("id"));
            dto.setOrderNumber(obj.optString("orderNumber"));
            dto.setStatus(obj.optString("status"));
            dto.setTotalAmount(obj.optDouble("totalAmount"));
            dto.setOrderDate(obj.optString("orderDate"));
            dto.setCustomerName(obj.optString("customerName"));
            orders.add(dto);
        }
        
        return orders;
    }

    private List<ProductDto> parseProducts(String json) {
        List<ProductDto> products = new ArrayList<>();
        JSONArray arr = new JSONArray(json);
        
        for (int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);
            ProductDto dto = new ProductDto();
            dto.setId(obj.optLong("id"));
            dto.setName(obj.optString("name"));
            dto.setPrice(obj.optDouble("price"));
            dto.setStockQuantity(obj.optInt("stockQuantity"));
            dto.setCategory(obj.optString("category"));
            products.add(dto);
        }
        
        return products;
    }

    private List<UserDto> parseUsers(String json) {
        List<UserDto> users = new ArrayList<>();
        JSONArray arr = new JSONArray(json);
        
        for (int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);
            UserDto dto = new UserDto();
            dto.setId(obj.optLong("id"));
            dto.setUsername(obj.optString("username"));
            dto.setEmail(obj.optString("email"));
            dto.setRole(obj.optString("role"));
            dto.setActive(obj.optBoolean("active"));
            users.add(dto);
        }
        
        return users;
    }

    private List<StockDto> parseStocks(String json) {
        List<StockDto> stocks = new ArrayList<>();
        JSONArray arr = new JSONArray(json);
        
        for (int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);
            StockDto dto = new StockDto();
            dto.setId(obj.optLong("id"));
            dto.setProductName(obj.optString("productName"));
            dto.setQuantity(obj.optInt("quantity"));
            dto.setWarehouse(obj.optString("warehouse"));
            dto.setLastUpdated(obj.optString("lastUpdated"));
            stocks.add(dto);
        }
        
        return stocks;
    }

    private List<PageVisitDto> parseVisits(String json) {
        List<PageVisitDto> visits = new ArrayList<>();
        JSONArray arr = new JSONArray(json);
        for (int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);
            PageVisitDto dto = new PageVisitDto();
            dto.setPageName(obj.optString("pageName"));
            dto.setVisitDateTime(obj.optString("visitDateTime"));
            dto.setVisitorId(obj.optString("visitorId"));
            visits.add(dto);
        }
        return visits;
    }
} 