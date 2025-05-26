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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "test_user", roles = {"USER"})
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

    @Autowired
    private FeedbackRepository feedbackRepository;

    private Long orderId;

    @BeforeEach
    public void setup() {
        // clear dependent data first to avoid FK constraints
        feedbackRepository.deleteAll();
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        userRepository.deleteAll();
        objectMapper.registerModule(new JavaTimeModule());

        // create a user
        User user = new User();
        user.setUsername("test_user");
        user.setPassword("password");
        user.setEmail("test@user.com");
        user.setAddress("Somewhere");
        user = userRepository.save(user);

        // create an order
        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);
        order.setUser(user);
        order.setTotal(BigDecimal.valueOf(100.00));
        order = orderRepository.save(order);

        orderId = order.getId();
    }

    @Test
    public void testCreateAndGetPayment() throws Exception {
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

        mockMvc.perform(get("/api/payments/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())))
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.amount", is(150.50)));
    }

    @Test
    public void testUpdatePayment() throws Exception {
        PaymentDTO dto = new PaymentDTO();
        dto.setOrderId(orderId);
        dto.setStatus("PENDING");
        dto.setAmount(BigDecimal.valueOf(200.00));
        dto.setPaymentDate(LocalDateTime.now());

        String response = mockMvc.perform(post("/api/payments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        PaymentDTO created = objectMapper.readValue(response, PaymentDTO.class);
        created.setStatus("COMPLETED");
        created.setAmount(BigDecimal.valueOf(300.00));
        created.setPaymentDate(LocalDateTime.now().plusDays(1));

        mockMvc.perform(put("/api/payments/" + created.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("COMPLETED")))
                .andExpect(jsonPath("$.amount", is(300.00)));
    }

    @Test
    public void testDeletePayment() throws Exception {
        PaymentDTO dto = new PaymentDTO();
        dto.setOrderId(orderId);
        dto.setStatus("PENDING");
        dto.setAmount(BigDecimal.valueOf(50.00));
        dto.setPaymentDate(LocalDateTime.now());

        String response = mockMvc.perform(post("/api/payments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        PaymentDTO created = objectMapper.readValue(response, PaymentDTO.class);

        mockMvc.perform(delete("/api/payments/" + created.getId())
                        .with(csrf()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/payments/" + created.getId()))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void testGetPayment_NotFound() throws Exception {
        // ask for a payment id that doesn’t exist → 404
        mockMvc.perform(get("/api/payments/{id}", 99999L))
                .andExpect(status().isNotFound())
                .andExpect(status().reason(containsString("Payment not found")));
    }

    @Test
    public void testDeletePayment_NotFound() throws Exception {
        // deleting a non‐existent payment → 404
        mockMvc.perform(delete("/api/payments/{id}", 88888L).with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(status().reason(containsString("Payment not found")));
    }

    @Test
    public void testCreatePayment_InvalidOrder() throws Exception {
        // point at an orderId that doesn’t exist → 400 Bad Request
        PaymentDTO bad = new PaymentDTO();
        bad.setOrderId(123456L);
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
    public void testUpdatePayment_NotFound() throws Exception {
        // updating a non‐existent id → 404
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
    public void testUpdatePayment_InvalidOrder() throws Exception {
        // create a valid payment…
        PaymentDTO created = createPayment(orderId, "PENDING", BigDecimal.ONE);

        // then try to re‐assign to a non‐existent order → 400
        created.setOrderId(999999L);

        mockMvc.perform(put("/api/payments/{id}", created.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isBadRequest())
                .andExpect(status().reason(containsString("No order exists with id")));
    }

    //
    // helper to keep things DRY
    //
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