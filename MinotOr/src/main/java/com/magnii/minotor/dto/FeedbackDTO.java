package com.magnii.minotor.dto;
import lombok.Data;

@Data
public class FeedbackDTO {
    private Long id;
    private Long userId;
    private Long orderId;
    private int rating;
    private String comment;
}