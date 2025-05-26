package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@WithMockUser
public class OrderControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private OrderDetailRepository orderDetailRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    public void setUp() {
        // clean up in correct order to avoid FK violations
        orderDetailRepository.deleteAllInBatch();
        orderRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();

        objectMapper.registerModule(new JavaTimeModule());

        // create a user fixture
        User u = new User();
        u.setUsername("testuser");
        u.setPassword("password");
        u.setEmail("test@example.com");
        u.setAddress("123 Main St");
        testUser = userRepository.saveAndFlush(u);
    }

    private OrderDTO makeDto(Long userId, String status, BigDecimal total) {
        OrderDTO dto = new OrderDTO();
        dto.setUserId(userId);
        dto.setDatePlaced(LocalDateTime.now());
        dto.setStatus(status);
        dto.setTotal(total);
        return dto;
    }

    @Test
    public void testCreateAndGetOrder() throws Exception {
        OrderDTO toCreate = makeDto(testUser.getId(), "PENDING", BigDecimal.valueOf(150.00));
        String payload = objectMapper.writeValueAsString(toCreate);

        String json = mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.total", is(150.00)))
                .andReturn().getResponse().getContentAsString();

        OrderDTO created = objectMapper.readValue(json, OrderDTO.class);

        mockMvc.perform(get("/api/orders/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())));
    }

    @Test
    public void testListAllOrders() throws Exception {
        // create first order with status PENDING
        OrderDTO o1 = objectMapper.readValue(
                mockMvc.perform(post("/api/orders").with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(
                                        makeDto(testUser.getId(), "PENDING", BigDecimal.valueOf(10)))))
                        .andExpect(status().isOk())
                        .andReturn().getResponse().getContentAsString(),
                OrderDTO.class);

        // create second order with status COMPLETED
        OrderDTO o2 = objectMapper.readValue(
                mockMvc.perform(post("/api/orders").with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(
                                        makeDto(testUser.getId(), "COMPLETED", BigDecimal.valueOf(20)))))
                        .andExpect(status().isOk())
                        .andReturn().getResponse().getContentAsString(),
                OrderDTO.class);

        // verify we get exactly those two back
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(o1.getId().intValue())))
                .andExpect(jsonPath("$[1].id", is(o2.getId().intValue())));
    }

    @Test
    public void testGetOrdersByUserId() throws Exception {
        mockMvc.perform(post("/api/orders").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                makeDto(testUser.getId(),"COMPLETED",BigDecimal.valueOf(250)))))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/orders/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status", is("COMPLETED")));
    }

    @Test
    public void testGetOrdersByStatus() throws Exception {
        mockMvc.perform(post("/api/orders").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                makeDto(testUser.getId(),"CANCELLED",BigDecimal.valueOf(300)))))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/orders/status/CANCELLED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status", is("CANCELLED")));
    }

    @Test
    public void testUpdateOrder() throws Exception {
        // 1) create an order with a valid enum
        String createdJson = mockMvc.perform(post("/api/orders").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                makeDto(testUser.getId(), "PENDING", BigDecimal.valueOf(100)))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        OrderDTO created = objectMapper.readValue(createdJson, OrderDTO.class);

        // 2) prepare an update DTO
        // — use a status that actually exists in your enum (e.g. "COMPLETED")
        // — put the userId back into the DTO so @NotNull validation will pass
        created.setStatus("COMPLETED");
        created.setTotal(BigDecimal.valueOf(123.45));
        created.setUserId(testUser.getId());

        // 3) call PUT and assert OK
        mockMvc.perform(put("/api/orders/{id}", created.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("COMPLETED")))
                .andExpect(jsonPath("$.total", is(123.45)));

        // 4) double-check via GET
        mockMvc.perform(get("/api/orders/{id}", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("COMPLETED")));
    }

    @Test
    public void testDeleteOrder() throws Exception {
        // create
        String createdJson = mockMvc.perform(post("/api/orders").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                makeDto(testUser.getId(),"PENDING",BigDecimal.valueOf(50)))))
                .andReturn().getResponse().getContentAsString();
        OrderDTO created = objectMapper.readValue(createdJson, OrderDTO.class);

        // delete
        mockMvc.perform(delete("/api/orders/" + created.getId()).with(csrf()))
                .andExpect(status().isNoContent());

        // 404 afterwards
        mockMvc.perform(get("/api/orders/" + created.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetNonexistentOrderReturns404() throws Exception {
        mockMvc.perform(get("/api/orders/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateOrderValidationFails() throws Exception {
        OrderDTO bad = new OrderDTO(); // all null/blank
        mockMvc.perform(post("/api/orders").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
        // you can assert on field‐level errors here once you add @Valid & @NotNull
    }

    @Test
    public void testCreateOrderWithBadUserIdReturns400() throws Exception {
        OrderDTO dto = makeDto(9999L, "PENDING", BigDecimal.valueOf(100));
        mockMvc.perform(post("/api/orders").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testTransactionLoadsOrderDetailsProperly() {
        Order o = new Order();
        o.setUser(testUser);
        o.setDatePlaced(LocalDateTime.now());
        o.setStatus(Order.OrderStatus.PENDING);
        o.setTotal(BigDecimal.TEN);
        o = orderRepository.save(o);

        Order fetched = orderRepository.findById(o.getId()).orElseThrow();
        // this will print “true” once your @OneToMany(fetch=LAZY) is properly overridden in service/mapper
        System.out.println("orderDetails initialized? " + Hibernate.isInitialized(fetched.getOrderDetails()));
    }
}