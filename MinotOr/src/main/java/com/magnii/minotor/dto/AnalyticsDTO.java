package com.magnii.minotor.dto;

public class AnalyticsDTO {
    private String metric;
    private double value;
    private String date;

    public AnalyticsDTO() {}

    public AnalyticsDTO(String metric, double value, String date) {
        this.metric = metric;
        this.value = value;
        this.date = date;
    }

    public String getMetric() {
        return metric;
    }

    public void setMetric(String metric) {
        this.metric = metric;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
} 