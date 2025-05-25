package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.FeedbackDTO;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.User;
import com.magnii.minotor.model.Order.OrderStatus;
import com.magnii.minotor.repository.FeedbackRepository;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@WithMockUser
public class FeedbackControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    private Long userId;
    private Long orderId;

    @BeforeEach
    public void setUp() {
        feedbackRepository.deleteAll();
        orderRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();
        user.setUsername("feedbackuser");
        user.setPassword("password");
        user.setEmail("feedback@example.com");
        user.setAddress("Feedback Address");
        user = userRepository.save(user);
        userId = user.getId();

        Order order = new Order();
        order.setUser(user);
        order.setDatePlaced(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setTotal(BigDecimal.valueOf(50));
        order = orderRepository.save(order);
        orderId = order.getId();
    }

    @Test
    public void testCreateAndGetFeedback() throws Exception {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setUserId(userId);
        dto.setOrderId(orderId);
        dto.setRating(4);
        dto.setComment("Good service");

        MvcResult result = mockMvc.perform(post("/api/feedback")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rating", is(4)))
                .andExpect(jsonPath("$.comment", is("Good service")))
                .andReturn();

        FeedbackDTO created = objectMapper.readValue(result.getResponse().getContentAsString(), FeedbackDTO.class);

        mockMvc.perform(get("/api/feedback/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())))
                .andExpect(jsonPath("$.rating", is(4)));
    }

    @Test
    public void testUpdateFeedback() throws Exception {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setUserId(userId);
        dto.setOrderId(orderId);
        dto.setRating(3);
        dto.setComment("Average service");

        MvcResult result = mockMvc.perform(post("/api/feedback")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        FeedbackDTO created = objectMapper.readValue(result.getResponse().getContentAsString(), FeedbackDTO.class);

        created.setRating(5);
        created.setComment("Excellent!");

        mockMvc.perform(put("/api/feedback/" + created.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rating", is(5)))
                .andExpect(jsonPath("$.comment", is("Excellent!")));
    }

    @Test
    public void testDeleteFeedback() throws Exception {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setUserId(userId);
        dto.setOrderId(orderId);
        dto.setRating(2);
        dto.setComment("Not satisfied");

        MvcResult result = mockMvc.perform(post("/api/feedback")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        FeedbackDTO created = objectMapper.readValue(result.getResponse().getContentAsString(), FeedbackDTO.class);

        mockMvc.perform(delete("/api/feedback/" + created.getId()).with(csrf()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/feedback/" + created.getId()))
                .andExpect(status().is4xxClientError());
    }
}