package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.controller.OrderController;
import com.magnii.minotor.dto.OrderDTO;
import com.magnii.minotor.mapper.OrderMapper;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class OrderControllerTest {

    private OrderService orderService;
    private OrderMapper orderMapper;
    private MockMvc mvc;
    private ObjectMapper om;

    private Order order;
    private OrderDTO dto;

    @BeforeEach
    void setup() {
        orderService = Mockito.mock(OrderService.class);
        orderMapper = Mockito.mock(OrderMapper.class);
        mvc = MockMvcBuilders.standaloneSetup(new OrderController(orderService, orderMapper)).build();
        om = new ObjectMapper();

        order = new Order();
        order.setId(10L);
        order.setDatePlaced(LocalDateTime.now());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotal(BigDecimal.valueOf(100));

        dto = new OrderDTO();
        dto.setId(10L);
        dto.setUserId(1L);
        dto.setDatePlaced(order.getDatePlaced());
        dto.setStatus("PENDING");
        dto.setTotal(BigDecimal.valueOf(100));
    }

    @Test
    void getOrderById_ok() throws Exception {
        when(orderService.getOrderById(10L)).thenReturn(dto);

        mvc.perform(get("/api/orders/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void getAllOrders_ok() throws Exception {
        when(orderService.getAllOrders()).thenReturn(List.of(dto));

        mvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10));
    }

    @Test
    void getOrdersByUserId_ok() throws Exception {
        when(orderService.getOrdersByUserId(1L)).thenReturn(List.of(dto));

        mvc.perform(get("/api/orders/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10));
    }

    @Test
    void getOrdersByStatus_ok() throws Exception {
        when(orderService.getOrdersByStatus("PENDING")).thenReturn(List.of(dto));

        mvc.perform(get("/api/orders/status/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }




    @Test
    void deleteOrder_ok() throws Exception {
        mvc.perform(delete("/api/orders/10"))
                .andExpect(status().isNoContent());
    }
}