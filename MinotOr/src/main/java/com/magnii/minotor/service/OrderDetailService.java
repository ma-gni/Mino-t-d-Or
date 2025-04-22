package com.magnii.minotor.service;

import com.magnii.minotor.dto.OrderDetailDTO;
import com.magnii.minotor.mapper.OrderDetailMapper;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.OrderDetail;
import com.magnii.minotor.model.Product;
import com.magnii.minotor.repository.OrderDetailRepository;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;
    private final OrderDetailMapper orderDetailMapper;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderDetailService(OrderDetailRepository orderDetailRepository, OrderDetailMapper orderDetailMapper,
                              OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderDetailRepository = orderDetailRepository;
        this.orderDetailMapper = orderDetailMapper;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // Create a new OrderDetail
    public OrderDetailDTO createOrderDetail(OrderDetailDTO orderDetailDTO) {
        OrderDetail orderDetail = orderDetailMapper.toEntity(orderDetailDTO);

        // Fetch and assign Order and Product entities
        Order order = orderRepository.findById(orderDetailDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Product product = productRepository.findById(orderDetailDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        orderDetail.setOrder(order);
        orderDetail.setProduct(product);

        OrderDetail savedOrderDetail = orderDetailRepository.save(orderDetail);
        return orderDetailMapper.toDto(savedOrderDetail);
    }



    public OrderDetailDTO getOrderDetailById(Long id) {
        return orderDetailRepository.findById(id)
                .map(orderDetailMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderDetail not found with id: " + id));
    }

    // Retrieve all OrderDetails by Order ID using streams
    public List<OrderDetailDTO> getOrderDetailsByOrderId(Long orderId) {
        return orderDetailRepository.findByOrderId(orderId)
                .stream()
                .map(orderDetailMapper::toDto)
                .collect(Collectors.toList());
    }

    // Retrieve all OrderDetails by Product ID using streams
    public List<OrderDetailDTO> getOrderDetailsByProductId(Long productId) {
        return orderDetailRepository.findByProductId(productId)
                .stream()
                .map(orderDetailMapper::toDto)
                .collect(Collectors.toList());
    }

    // Update an existing OrderDetail by its ID
    public OrderDetailDTO updateOrderDetail(Long id, OrderDetailDTO orderDetailDTO) {
        OrderDetail existingOrderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDetail not found with id: " + id));

        // Update fields (assuming you want to update quantity and priceAtOrder)
        existingOrderDetail.setQuantity(orderDetailDTO.getQuantity());
        existingOrderDetail.setPriceAtOrder(orderDetailDTO.getPriceAtOrder());

        // If needed, update associations: order and product should be handled carefully,
        // here we assume that they are not updated via this method.

        OrderDetail updatedOrderDetail = orderDetailRepository.save(existingOrderDetail);
        return orderDetailMapper.toDto(updatedOrderDetail);
    }

    // Delete an OrderDetail by its ID
    public void deleteOrderDetail(Long id) {
        orderDetailRepository.deleteById(id);
    }
}