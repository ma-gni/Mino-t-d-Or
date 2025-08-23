package com.magnii.minotor.service;

import com.magnii.minotor.dto.OrderDetailDTO;
import com.magnii.minotor.mapper.OrderDetailMapper;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.OrderDetail;
import com.magnii.minotor.model.Product;
import com.magnii.minotor.repository.OrderDetailRepository;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.ProductRepository;
import com.magnii.minotor.service.OrderDetailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class OrderDetailServiceTest {

    @Mock private OrderDetailRepository orderDetailRepository;
    @Mock private OrderDetailMapper orderDetailMapper;
    @Mock private OrderRepository orderRepository;
    @Mock private ProductRepository productRepository;

    @InjectMocks private OrderDetailService service;

    private Order order;
    private Product product;
    private OrderDetail entity;
    private OrderDetailDTO dto;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);

        order = new Order();
        order.setId(1L);
        product = new Product();
        product.setId(2L);

        entity = new OrderDetail();
        entity.setId(10L);
        entity.setOrder(order);
        entity.setProduct(product);
        entity.setQuantity(3);
        entity.setPriceAtOrder(BigDecimal.valueOf(20));

        dto = new OrderDetailDTO();
        dto.setId(10L);
        dto.setOrderId(1L);
        dto.setProductId(2L);
        dto.setQuantity(3);
        dto.setPriceAtOrder(BigDecimal.valueOf(20));
    }

    @Test
    void createOrderDetail_ok() {
        when(orderDetailMapper.toEntity(dto)).thenReturn(entity);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product));
        when(orderDetailRepository.save(entity)).thenReturn(entity);
        when(orderDetailMapper.toDto(entity)).thenReturn(dto);

        OrderDetailDTO result = service.createOrderDetail(dto);

        assertThat(result.getId()).isEqualTo(10L);
        verify(orderDetailRepository).save(entity);
    }

    @Test
    void createOrderDetail_orderNotFound_throws() {
        when(orderDetailMapper.toEntity(dto)).thenReturn(entity);
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.createOrderDetail(dto));
    }

    @Test
    void getOrderDetailById_found() {
        when(orderDetailRepository.findById(10L)).thenReturn(Optional.of(entity));
        when(orderDetailMapper.toDto(entity)).thenReturn(dto);

        OrderDetailDTO result = service.getOrderDetailById(10L);

        assertThat(result.getId()).isEqualTo(10L);
    }

    @Test
    void getOrderDetailById_notFound_throws() {
        when(orderDetailRepository.findById(10L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> service.getOrderDetailById(10L));
    }

    @Test
    void getOrderDetailsByOrderId_ok() {
        when(orderDetailRepository.findByOrderId(1L)).thenReturn(List.of(entity));
        when(orderDetailMapper.toDto(entity)).thenReturn(dto);

        var result = service.getOrderDetailsByOrderId(1L);

        assertThat(result).hasSize(1);
    }

    @Test
    void getOrderDetailsByProductId_ok() {
        when(orderDetailRepository.findByProductId(2L)).thenReturn(List.of(entity));
        when(orderDetailMapper.toDto(entity)).thenReturn(dto);

        var result = service.getOrderDetailsByProductId(2L);

        assertThat(result).hasSize(1);
    }

    @Test
    void updateOrderDetail_found_updates() {
        when(orderDetailRepository.findById(10L)).thenReturn(Optional.of(entity));
        when(orderDetailRepository.save(entity)).thenReturn(entity);
        when(orderDetailMapper.toDto(entity)).thenReturn(dto);

        OrderDetailDTO result = service.updateOrderDetail(10L, dto);

        assertThat(result.getId()).isEqualTo(10L);
        verify(orderDetailRepository).save(entity);
    }

    @Test
    void updateOrderDetail_notFound_throws() {
        when(orderDetailRepository.findById(10L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.updateOrderDetail(10L, dto));
    }

    @Test
    void deleteOrderDetail_ok() {
        service.deleteOrderDetail(10L);
        verify(orderDetailRepository).deleteById(10L);
    }
}