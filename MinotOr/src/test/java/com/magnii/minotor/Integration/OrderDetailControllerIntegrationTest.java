package com.magnii.minotor.Integration;

import com.magnii.minotor.MinotOrApplication;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.OrderDetail;
import com.magnii.minotor.model.Product;
import com.magnii.minotor.model.Role;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.OrderDetailRepository;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.ProductRepository;
import com.magnii.minotor.repository.RoleRepository;
import com.magnii.minotor.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = MinotOrApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureMockMvc
@WithMockUser
public class OrderDetailControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderDetailRepository orderDetailRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private OrderDetail testOrderDetail;

    @BeforeEach
    public void setup() {
        orderDetailRepository.deleteAll();
        orderRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();

        Role userRole = new Role(); userRole.setName("ROLE_USER");
        userRole = roleRepository.save(userRole);

        User user = new User();
        user.setUsername("testuser");
        user.setPassword(passwordEncoder.encode("password"));
        user.setEmail("testuser@example.com");
        user.setAddress("123 Test St.");
        user.setActivated(true);
        user.setRoles(Set.of(userRole));
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(BigDecimal.valueOf(10.0));
        product.setStockQuantity(100);
        product = productRepository.save(product);

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotal(BigDecimal.valueOf(20.0));
        order.setDatePlaced(LocalDateTime.now());
        order = orderRepository.save(order);

        testOrderDetail = new OrderDetail();
        testOrderDetail.setOrder(order);
        testOrderDetail.setProduct(product);
        testOrderDetail.setQuantity(2);
        testOrderDetail.setPriceAtOrder(BigDecimal.valueOf(10.0));
        testOrderDetail = orderDetailRepository.save(testOrderDetail);
    }

    @Test
    public void whenGetById_thenReturns200() throws Exception {
        mockMvc.perform(get("/api/order-details/{id}", testOrderDetail.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testOrderDetail.getId()));
    }

    @Test
    public void whenGetByOrderId_thenReturnsList() throws Exception {
        mockMvc.perform(get("/api/order-details/order/{orderId}", testOrderDetail.getOrder().getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testOrderDetail.getId()));
    }

    @Test
    public void whenGetByProductId_thenReturnsList() throws Exception {
        mockMvc.perform(get("/api/order-details/product/{productId}", testOrderDetail.getProduct().getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testOrderDetail.getId()));
    }

    @Test
    public void whenCreate_thenReturns200AndFields() throws Exception {
        Map<String, Object> payload = Map.of(
                "orderId", testOrderDetail.getOrder().getId(),
                "productId", testOrderDetail.getProduct().getId(),
                "quantity", 1,
                "priceAtOrder", 5.0
        );
        mockMvc.perform(post("/api/order-details")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.quantity").value(1))
                .andExpect(jsonPath("$.priceAtOrder").value(5.0));
    }

    @Test
    public void whenUpdate_thenReturnsUpdated() throws Exception {
        Map<String, Object> update = Map.of(
                "quantity", 5,
                "priceAtOrder", 15.0
        );
        mockMvc.perform(put("/api/order-details/{id}", testOrderDetail.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(5))
                .andExpect(jsonPath("$.priceAtOrder").value(15.0));
    }

    @Test
    public void whenDelete_thenNoContentAndNotFound() throws Exception {
        mockMvc.perform(delete("/api/order-details/{id}", testOrderDetail.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/order-details/{id}", testOrderDetail.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    public void whenNotFound_thenReturns404() throws Exception {
        mockMvc.perform(get("/api/order-details/{id}", 9999L))
                .andExpect(status().isNotFound());
    }
}