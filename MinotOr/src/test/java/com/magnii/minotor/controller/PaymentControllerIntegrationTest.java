package com.magnii.minotor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.PaymentDTO;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.Payment;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.PaymentRepository;
import com.magnii.minotor.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PaymentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    private Long orderId;

    @BeforeEach
    public void setUp() {
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();
        user.setUsername("paymentuser");
        user.setEmail("payment@example.com");
        user.setPassword("securepassword");
        user.setAddress("123 Payment Street");
        user = userRepository.save(user);

        Order order = new Order();
        order.setUser(user);
        order.setTotal(new BigDecimal("99.99"));
        order.setStatus(Order.OrderStatus.COMPLETED);
        order.setDatePlaced(LocalDateTime.now());
        order = orderRepository.save(order);

        orderId = order.getId();
    }

    @Test
    public void testCreateAndGetPayment() throws Exception {
        PaymentDTO dto = new PaymentDTO(null, orderId, "COMPLETED", new BigDecimal("99.99"), LocalDateTime.now());

        String response = mockMvc.perform(post("/api/payments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        PaymentDTO created = objectMapper.readValue(response, PaymentDTO.class);

        mockMvc.perform(get("/api/payments/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.getId()));
    }

    @Test
    public void testUpdatePayment() throws Exception {
        Payment payment = new Payment();
        payment.setOrder(orderRepository.findById(orderId).get());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setAmount(new BigDecimal("99.99"));
        payment.setPaymentDate(LocalDateTime.now());
        payment = paymentRepository.save(payment);

        PaymentDTO updateDto = new PaymentDTO(payment.getId(), orderId, "COMPLETED", new BigDecimal("120.00"), LocalDateTime.now());

        mockMvc.perform(put("/api/payments/" + payment.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.amount").value(120.00));
    }

    @Test
    public void testDeletePayment() throws Exception {
        Payment payment = new Payment();
        payment.setOrder(orderRepository.findById(orderId).get());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setAmount(new BigDecimal("99.99"));
        payment.setPaymentDate(LocalDateTime.now());
        payment = paymentRepository.save(payment);

        mockMvc.perform(delete("/api/payments/" + payment.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testGetAllPayments() throws Exception {
        Payment payment = new Payment();
        payment.setOrder(orderRepository.findById(orderId).get());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setAmount(new BigDecimal("50.00"));
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);

        mockMvc.perform(get("/api/payments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].amount").value(50.00));
    }

    @TestConfiguration
    public static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }
}