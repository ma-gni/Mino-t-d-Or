package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.controller.FeedbackController;
import com.magnii.minotor.dto.FeedbackDTO;
import com.magnii.minotor.service.FeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class FeedbackControllerTest {

    private FeedbackService feedbackService;
    private MockMvc mvc;
    private ObjectMapper om;

    @BeforeEach
    void setup() {
        feedbackService = Mockito.mock(FeedbackService.class);
        mvc = MockMvcBuilders.standaloneSetup(new FeedbackController(feedbackService)).build();
        om = new ObjectMapper();
    }

    private FeedbackDTO sample() {
        FeedbackDTO d = new FeedbackDTO();
        d.setId(10L);
        d.setUserId(1L);
        d.setOrderId(2L);
        d.setRating(5);
        d.setComment("Great");
        return d;
    }

    @Test
    void getFeedback_ok_returns200() throws Exception {
        when(feedbackService.getFeedback(10L)).thenReturn(sample());

        mvc.perform(get("/api/feedback/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void createFeedback_ok_returns200() throws Exception {
        when(feedbackService.saveFeedback(any())).thenReturn(sample());

        mvc.perform(post("/api/feedback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(sample())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void updateFeedback_ok_returns200() throws Exception {
        when(feedbackService.updateFeedback(any())).thenReturn(sample());

        mvc.perform(put("/api/feedback/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(sample())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void deleteFeedback_returns204() throws Exception {
        mvc.perform(delete("/api/feedback/10"))
                .andExpect(status().isNoContent());
    }
}