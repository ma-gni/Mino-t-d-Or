package com.magnii.minotor.service;

import com.magnii.minotor.dto.OrderDTO;
import com.magnii.minotor.mapper.OrderMapper;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.Order.OrderStatus;
import com.magnii.minotor.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderService orderService;

    @Test
    public void testGetOrderById_Success() {
        Long orderId = 1L;
        Order order = new Order();
        order.setId(orderId);
        order.setTotal(BigDecimal.valueOf(100.0));
        order.setDatePlaced(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(orderId);
        orderDTO.setTotal(BigDecimal.valueOf(100.0));
        // Assume orderDTO.userId, orderDetails, and other fields are set as needed

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(orderMapper.toDto(order)).thenReturn(orderDTO);

        OrderDTO result = orderService.getOrderById(orderId);

        assertNotNull(result);
        assertEquals(orderId, result.getId());
        assertEquals(BigDecimal.valueOf(100.0), result.getTotal());
        verify(orderRepository, times(1)).findById(orderId);
        verify(orderMapper, times(1)).toDto(order);
    }

}