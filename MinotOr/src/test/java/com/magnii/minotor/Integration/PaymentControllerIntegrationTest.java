package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.magnii.minotor.dto.PaymentDTO;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.User;
import com.magnii.minotor.model.Order.OrderStatus;
import com.magnii.minotor.repository.FeedbackRepository;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.PaymentRepository;
import com.magnii.minotor.repository.UserRepository;
import com.magnii.minotor.service.NotificationService; // <- mocked so context loads

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.mockito.Mockito;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = Replace.ANY)
@ActiveProfiles("test")
@WithMockUser(username = "test_user", roles = {"USER"})
class PaymentControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Autowired private PaymentRepository paymentRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private FeedbackRepository feedbackRepository;

    // 👇 Mock the bean that drags in TokenService so the context starts
    private Long orderId;

    @TestConfiguration
    static class MockNotificationServiceConfig {
        @Bean
        public NotificationService notificationService() {
            return Mockito.mock(NotificationService.class);
        }
    }

    @Autowired
    private NotificationService notificationService;

    @BeforeEach
    void setup() {
        // Clean tables in safe FK order
        feedbackRepository.deleteAll();
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        userRepository.deleteAll();

        objectMapper.registerModule(new JavaTimeModule());

        // Seed a User
        User u = new User();
        u.setUsername("test_user");
        u.setPassword("password");
        u.setEmail("test@user.com");
        u.setAddress("Somewhere");
        u = userRepository.save(u);

        // Seed an Order
        Order o = new Order();
        o.setUser(u);
        o.setStatus(OrderStatus.PENDING);
        o.setTotal(BigDecimal.valueOf(100.00));
        o = orderRepository.save(o);
        orderId = o.getId();
    }

    @Test
    void testCreateAndGetPayment() throws Exception {
        PaymentDTO dto = new PaymentDTO();
        dto.setOrderId(orderId);
        dto.setStatus("PENDING");
        dto.setAmount(BigDecimal.valueOf(150.50));
        dto.setPaymentDate(LocalDateTime.now());

        String response = mockMvc.perform(post("/api/payments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.amount", is(150.50)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        PaymentDTO created = objectMapper.readValue(response, PaymentDTO.class);

        mockMvc.perform(get("/api/payments/{id}", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())))
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.amount", is(150.50)));
    }

    @Test
    void testUpdatePayment() throws Exception {
        PaymentDTO created = createPayment(orderId, "PENDING", BigDecimal.valueOf(200.00));

        created.setStatus("COMPLETED");
        created.setAmount(BigDecimal.valueOf(300.00));
        created.setPaymentDate(LocalDateTime.now().plusDays(1));

        mockMvc.perform(put("/api/payments/{id}", created.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("COMPLETED")))
                .andExpect(jsonPath("$.amount", is(300.00)));
    }

    @Test
    void testDeletePayment() throws Exception {
        PaymentDTO created = createPayment(orderId, "PENDING", BigDecimal.valueOf(50.00));

        mockMvc.perform(delete("/api/payments/{id}", created.getId()).with(csrf()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/payments/{id}", created.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetPayment_NotFound() throws Exception {
        mockMvc.perform(get("/api/payments/{id}", 99999L))
                .andExpect(status().isNotFound())
                .andExpect(status().reason(containsString("Payment not found")));
    }

    @Test
    void testDeletePayment_NotFound() throws Exception {
        mockMvc.perform(delete("/api/payments/{id}", 88888L).with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(status().reason(containsString("Payment not found")));
    }

    @Test
    void testCreatePayment_InvalidOrder() throws Exception {
        PaymentDTO bad = new PaymentDTO();
        bad.setOrderId(123456L); // not existing
        bad.setStatus("PENDING");
        bad.setAmount(BigDecimal.TEN);
        bad.setPaymentDate(LocalDateTime.now());

        mockMvc.perform(post("/api/payments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest())
                .andExpect(status().reason(containsString("No order exists with id")));
    }

    @Test
    void testUpdatePayment_NotFound() throws Exception {
        PaymentDTO dto = new PaymentDTO();
        dto.setOrderId(orderId);
        dto.setStatus("PENDING");
        dto.setAmount(BigDecimal.ONE);
        dto.setPaymentDate(LocalDateTime.now());

        mockMvc.perform(put("/api/payments/{id}", 55555L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound())
                .andExpect(status().reason(containsString("Payment not found")));
    }

    @Test
    void testUpdatePayment_InvalidOrder() throws Exception {
        PaymentDTO created = createPayment(orderId, "PENDING", BigDecimal.ONE);
        created.setOrderId(999999L); // try to rewire to missing order

        mockMvc.perform(put("/api/payments/{id}", created.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isBadRequest())
                .andExpect(status().reason(containsString("No order exists with id")));
    }

    // ---- helper ----
    private PaymentDTO createPayment(Long orderId, String status, BigDecimal amount) throws Exception {
        PaymentDTO dto = new PaymentDTO();
        dto.setOrderId(orderId);
        dto.setStatus(status);
        dto.setAmount(amount);
        dto.setPaymentDate(LocalDateTime.now());

        String json = mockMvc.perform(post("/api/payments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readValue(json, PaymentDTO.class);
    }
}