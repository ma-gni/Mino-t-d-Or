package com.magnii.minotor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.User;
import com.magnii.minotor.model.Order.OrderStatus;
import com.magnii.minotor.repository.DeliveryRepository;
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
public class DeliveryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    private Long dummyOrderId;

    @BeforeEach
    public void setUp() {
        deliveryRepository.deleteAll();
        orderRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");
        user.setEmail("testuser@example.com");
        user.setAddress("Test Address");
        User savedUser = userRepository.save(user);

        Order order = new Order();
        order.setUser(savedUser);
        order.setDatePlaced(LocalDateTime.now());
        order.setTotal(BigDecimal.valueOf(100.0));
        order.setStatus(OrderStatus.PENDING);
        Order savedOrder = orderRepository.save(order);

        dummyOrderId = savedOrder.getId();
    }

    @Test
    public void testCreateAndGetDelivery() throws Exception {
        DeliveryDTO deliveryDTO = new DeliveryDTO();
        deliveryDTO.setOrderId(dummyOrderId);
        deliveryDTO.setStatus("PREPARING");
        deliveryDTO.setAddress("123 Delivery St");

        String json = objectMapper.writeValueAsString(deliveryDTO);

        MvcResult result = mockMvc.perform(post("/api/deliveries")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PREPARING")))
                .andExpect(jsonPath("$.address", is("123 Delivery St")))
                .andReturn();

        DeliveryDTO created = objectMapper.readValue(result.getResponse().getContentAsString(), DeliveryDTO.class);
        Long deliveryId = created.getId();

        mockMvc.perform(get("/api/deliveries/" + deliveryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(deliveryId.intValue())))
                .andExpect(jsonPath("$.address", is("123 Delivery St")));
    }

    @Test
    public void testUpdateDelivery() throws Exception {
        DeliveryDTO deliveryDTO = new DeliveryDTO();
        deliveryDTO.setOrderId(dummyOrderId);
        deliveryDTO.setStatus("PREPARING");
        deliveryDTO.setAddress("Initial Address");

        String json = objectMapper.writeValueAsString(deliveryDTO);

        MvcResult postResult = mockMvc.perform(post("/api/deliveries")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        DeliveryDTO createdDelivery = objectMapper.readValue(postResult.getResponse().getContentAsString(), DeliveryDTO.class);

        createdDelivery.setStatus("SHIPPED");
        createdDelivery.setAddress("456 New Address");

        String updateJson = objectMapper.writeValueAsString(createdDelivery);

        mockMvc.perform(put("/api/deliveries/" + createdDelivery.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("SHIPPED")))
                .andExpect(jsonPath("$.address", is("456 New Address")));
    }

    @Test
    public void testDeleteDelivery() throws Exception {
        DeliveryDTO deliveryDTO = new DeliveryDTO();
        deliveryDTO.setOrderId(dummyOrderId);
        deliveryDTO.setStatus("PREPARING");
        deliveryDTO.setAddress("123 Delivery St");

        String json = objectMapper.writeValueAsString(deliveryDTO);

        MvcResult postResult = mockMvc.perform(post("/api/deliveries")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        DeliveryDTO createdDelivery = objectMapper.readValue(postResult.getResponse().getContentAsString(), DeliveryDTO.class);
        Long deliveryId = createdDelivery.getId();

        mockMvc.perform(delete("/api/deliveries/" + deliveryId).with(csrf()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/deliveries/" + deliveryId))
                .andExpect(status().isNotFound());
    }
}