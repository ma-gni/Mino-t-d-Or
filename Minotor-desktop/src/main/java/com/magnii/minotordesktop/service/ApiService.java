package com.magnii.minotordesktop.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class ApiService {
    private final String baseUrl;

    public ApiService(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String get(String endpoint) throws Exception {
        URL url = new URL(baseUrl + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");

        if (conn.getResponseCode() != 200) {
            throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
        }

        BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
        StringBuilder sb = new StringBuilder();
        String output;
        while ((output = br.readLine()) != null) {
            sb.append(output);
        }
        conn.disconnect();
        return sb.toString();
    }
} 