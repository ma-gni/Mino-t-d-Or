package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.OrderDTO;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.OrderDetailRepository;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.UserRepository;
import org.hibernate.Hibernate;
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

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@WithMockUser
public class OrderControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;

    private User testUser;
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @BeforeEach
    public void setUp() {
        // FIRST: delete orderDetails to avoid FK constraint violation
        orderDetailRepository.deleteAllInBatch(); // You need to autowire this repo
        orderRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();

        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");
        user.setEmail("test@example.com");
        user.setAddress("123 Main St");
        testUser = userRepository.saveAndFlush(user);
    }

    @Test
    public void testCreateAndGetOrder() throws Exception {
        OrderDTO dto = new OrderDTO();
        dto.setUserId(testUser.getId());
        dto.setDatePlaced(LocalDateTime.now());
        dto.setStatus("PENDING");
        dto.setTotal(BigDecimal.valueOf(150.00));

        String json = objectMapper.writeValueAsString(dto);

        String response = mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andReturn().getResponse().getContentAsString();

        OrderDTO created = objectMapper.readValue(response, OrderDTO.class);

        mockMvc.perform(get("/api/orders/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())));
    }

    @Test
    public void testGetOrdersByUserId() throws Exception {
        OrderDTO dto = new OrderDTO();
        dto.setUserId(testUser.getId());
        dto.setDatePlaced(LocalDateTime.now());
        dto.setStatus("COMPLETED");
        dto.setTotal(BigDecimal.valueOf(250.00));

        String json = objectMapper.writeValueAsString(dto);

        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/orders/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status", is("COMPLETED")));
    }

    @Test
    public void testGetOrdersByStatus() throws Exception {
        OrderDTO dto = new OrderDTO();
        dto.setUserId(testUser.getId());
        dto.setDatePlaced(LocalDateTime.now());
        dto.setStatus("CANCELLED");
        dto.setTotal(BigDecimal.valueOf(300.00));

        String json = objectMapper.writeValueAsString(dto);

        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/orders/status/CANCELLED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status", is("CANCELLED")));
    }

    @Test
    public void testTransactionLoadsOrderDetailsProperly() {
        Order order = new Order();
        order.setUser(testUser);
        order.setDatePlaced(LocalDateTime.now());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotal(BigDecimal.TEN);

        order = orderRepository.save(order);

        Order fetched = orderRepository.findById(order.getId()).orElseThrow();
        System.out.println("Order details initialized? " + Hibernate.isInitialized(fetched.getOrderDetails()));
    }
}