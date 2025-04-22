package com.magnii.minotor.service;

import com.magnii.minotor.dto.OrderDTO;
import com.magnii.minotor.mapper.OrderMapper;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, OrderMapper orderMapper, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.userRepository = userRepository;
    }

    public Order createOrder(OrderDTO dto) {
        Order order = new Order();
        order.setDatePlaced(dto.getDatePlaced());
        order.setStatus(Order.OrderStatus.valueOf(dto.getStatus()));
        order.setTotal(dto.getTotal());

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);

        return orderRepository.save(order);
    }

    public OrderDTO getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(orderMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(String statusStr) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(statusStr.toUpperCase());
        return orderRepository.findByStatus(status)
                .stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }
}