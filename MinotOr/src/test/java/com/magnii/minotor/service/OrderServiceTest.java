package com.magnii.minotor.service;

import com.magnii.minotor.dto.OrderDTO;
import com.magnii.minotor.mapper.OrderMapper;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.UserRepository;
import com.magnii.minotor.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private OrderMapper orderMapper;
    @Mock private UserRepository userRepository;

    @InjectMocks private OrderService orderService;

    private User user;
    private Order order;
    private OrderDTO dto;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);

        order = new Order();
        order.setId(10L);
        order.setUser(user);
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
    void createOrder_ok() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(orderRepository.save(any())).thenReturn(order);

        Order created = orderService.createOrder(dto);

        assertThat(created.getUser().getId()).isEqualTo(1L);
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_userNotFound_throws() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.createOrder(dto));
    }

    @Test
    void getOrderById_found() {
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(orderMapper.toDto(order)).thenReturn(dto);

        OrderDTO result = orderService.getOrderById(10L);

        assertThat(result.getId()).isEqualTo(10L);
    }

    @Test
    void getOrderById_notFound_throws() {
        when(orderRepository.findById(10L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.getOrderById(10L));
    }

    @Test
    void getAllOrders_ok() {
        when(orderRepository.findAll()).thenReturn(List.of(order));
        when(orderMapper.toDto(order)).thenReturn(dto);

        var result = orderService.getAllOrders();
        assertThat(result).hasSize(1);
    }

    @Test
    void getOrdersByUserId_ok() {
        when(orderRepository.findByUserId(1L)).thenReturn(List.of(order));
        when(orderMapper.toDto(order)).thenReturn(dto);

        var result = orderService.getOrdersByUserId(1L);
        assertThat(result).hasSize(1);
    }

    @Test
    void getOrdersByStatus_ok() {
        when(orderRepository.findByStatus(Order.OrderStatus.PENDING)).thenReturn(List.of(order));
        when(orderMapper.toDto(order)).thenReturn(dto);

        var result = orderService.getOrdersByStatus("pending");
        assertThat(result).hasSize(1);
    }

    @Test
    void getOrdersByStatus_invalid_throws() {
        assertThrows(ResponseStatusException.class, () -> orderService.getOrdersByStatus("wrong"));
    }

    @Test
    void updateOrder_found_updates() {
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapper.toDto(order)).thenReturn(dto);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Order updated = orderService.updateOrder(10L, dto);

        assertThat(updated.getId()).isEqualTo(10L);
        verify(orderRepository).save(order);
    }

    @Test
    void updateOrder_notFound_throws() {
        when(orderRepository.findById(10L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> orderService.updateOrder(10L, dto));
    }

    @Test
    void deleteOrder_exists_deletes() {
        when(orderRepository.existsById(10L)).thenReturn(true);
        orderService.deleteOrder(10L);
        verify(orderRepository).deleteById(10L);
    }

    @Test
    void deleteOrder_notExists_throws() {
        when(orderRepository.existsById(10L)).thenReturn(false);
        assertThrows(ResponseStatusException.class, () -> orderService.deleteOrder(10L));
    }
}