package com.magnii.minotor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.OrderDetailDTO;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.Product;
import com.magnii.minotor.model.User;
import com.magnii.minotor.model.Order.OrderStatus;
import com.magnii.minotor.repository.*;
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
import java.util.HashSet;

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@WithMockUser
public class OrderDetailControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderDetailRepository orderDetailRepository;
    @Autowired private FeedbackRepository feedbackRepository;

    private Long userId, orderId, productId;

    @BeforeEach
    public void setup() {
        orderDetailRepository.deleteAll();
        feedbackRepository.deleteAll(); // Ensure feedbacks referencing orders are deleted
        orderRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User(null, "testuser", "password", "user@example.com", "123 Test St", new HashSet<>(), new HashSet<>());
        userId = user.getId();

        Order order = new Order();
        order.setUser(user);
        order.setDatePlaced(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setTotal(BigDecimal.valueOf(100.00));
        order = orderRepository.save(order);
        orderId = order.getId();

        Product product = new Product();
        product.setName("Sample Product");
        product.setDescription("Test product");
        product.setPrice(BigDecimal.valueOf(25.00));
        product = productRepository.save(product);
        productId = product.getId();
    }

    @Test
    public void testCreateAndGetOrderDetail() throws Exception {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderId(orderId);
        dto.setProductId(productId);
        dto.setQuantity(2);
        dto.setPriceAtOrder(BigDecimal.valueOf(25.00));

        MvcResult result = mockMvc.perform(post("/api/order-details")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(2)))
                .andReturn();

        OrderDetailDTO created = objectMapper.readValue(result.getResponse().getContentAsString(), OrderDetailDTO.class);

        mockMvc.perform(get("/api/order-details/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())));
    }

    @Test
    public void testUpdateOrderDetail() throws Exception {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderId(orderId);
        dto.setProductId(productId);
        dto.setQuantity(1);
        dto.setPriceAtOrder(BigDecimal.valueOf(25.00));

        MvcResult result = mockMvc.perform(post("/api/order-details")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        OrderDetailDTO created = objectMapper.readValue(result.getResponse().getContentAsString(), OrderDetailDTO.class);
        created.setQuantity(5);
        created.setPriceAtOrder(BigDecimal.valueOf(20.00));

        mockMvc.perform(put("/api/order-details/" + created.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(5)))
                .andExpect(jsonPath("$.priceAtOrder", is(20.00)));
    }

    @Test
    public void testDeleteOrderDetail() throws Exception {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderId(orderId);
        dto.setProductId(productId);
        dto.setQuantity(1);
        dto.setPriceAtOrder(BigDecimal.valueOf(30.00));

        MvcResult result = mockMvc.perform(post("/api/order-details")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        OrderDetailDTO created = objectMapper.readValue(result.getResponse().getContentAsString(), OrderDetailDTO.class);

        mockMvc.perform(delete("/api/order-details/" + created.getId()).with(csrf()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/order-details/" + created.getId()))
                .andExpect(status().is4xxClientError());
    }
}