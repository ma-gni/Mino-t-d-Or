package com.magnii.minotor.service;

import com.magnii.minotor.dto.OrderDTO;
import com.magnii.minotor.mapper.OrderMapper;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper     orderMapper;
    private final UserRepository  userRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderMapper orderMapper,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderMapper     = orderMapper;
        this.userRepository  = userRepository;
    }

    public Order createOrder(OrderDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "User not found with id: " + dto.getUserId()
                ));

        Order order = new Order();
        order.setUser(user);
        order.setDatePlaced(dto.getDatePlaced());
        order.setStatus(Order.OrderStatus.valueOf(dto.getStatus().toUpperCase()));
        order.setTotal(dto.getTotal());
        return orderRepository.save(order);
    }

    public OrderDTO getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(orderMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found with id: " + id
                ));
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
        Order.OrderStatus status;
        try {
            status = Order.OrderStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid status: " + statusStr
            );
        }
        return orderRepository.findByStatus(status)
                .stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    public Order updateOrder(Long id, OrderDTO dto) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found with id: " + id
                ));

        // optionally update user
        if (! existing.getUser().getId().equals(dto.getUserId())) {
            User u = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "User not found with id: " + dto.getUserId()
                    ));
            existing.setUser(u);
        }

        existing.setDatePlaced(dto.getDatePlaced());

        try {
            existing.setStatus(Order.OrderStatus.valueOf(dto.getStatus().toUpperCase()));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid status: " + dto.getStatus()
            );
        }

        existing.setTotal(dto.getTotal());
        return orderRepository.save(existing);
    }

    public void deleteOrder(Long id) {
        if (! orderRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Order not found with id: " + id
            );
        }
        orderRepository.deleteById(id);
    }
}