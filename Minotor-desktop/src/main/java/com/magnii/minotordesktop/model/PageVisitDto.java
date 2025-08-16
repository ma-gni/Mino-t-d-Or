package com.magnii.minotordesktop.model;

public class PageVisitDto {
    private String pageName;
    private String visitDateTime; // ISO string, à parser si besoin
    private String visitorId;

    public String getPageName() {
        return pageName;
    }
    public void setPageName(String pageName) {
        this.pageName = pageName;
    }
    public String getVisitDateTime() {
        return visitDateTime;
    }
    public void setVisitDateTime(String visitDateTime) {
        this.visitDateTime = visitDateTime;
    }
    public String getVisitorId() {
        return visitorId;
    }
    public void setVisitorId(String visitorId) {
        this.visitorId = visitorId;
    }
} 