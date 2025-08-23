package com.magnii.minotor.service;

import com.magnii.minotor.dto.PaymentDTO;
import com.magnii.minotor.mapper.PaymentMapper;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.Payment;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PaymentServiceTest {

    @Mock private PaymentRepository paymentRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private PaymentMapper paymentMapper;

    @InjectMocks private PaymentService paymentService;

    private Payment payment;
    private PaymentDTO dto;
    private Order order;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        order = new Order();
        order.setId(1L);

        payment = new Payment();
        payment.setId(1L);
        payment.setOrder(order);
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setAmount(BigDecimal.valueOf(100));
        payment.setPaymentDate(LocalDateTime.now());

        dto = new PaymentDTO();
        dto.setId(1L);
        dto.setOrderId(1L);
        dto.setStatus("PENDING");
        dto.setAmount(BigDecimal.valueOf(100));
        dto.setPaymentDate(payment.getPaymentDate());
    }

    @Test
    void getAllPayments_ReturnsDtos() {
        when(paymentRepository.findAll()).thenReturn(Arrays.asList(payment));
        when(paymentMapper.toDto(payment)).thenReturn(dto);

        List<PaymentDTO> result = paymentService.getAllPayments();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
    }

    @Test
    void getPaymentById_Found_ReturnsDto() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(paymentMapper.toDto(payment)).thenReturn(dto);

        PaymentDTO result = paymentService.getPaymentById(1L);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void getPaymentById_NotFound_Throws() {
        when(paymentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.getPaymentById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Payment not found");
    }

    @Test
    void createPayment_Success() {
        when(paymentMapper.toEntity(dto)).thenReturn(payment);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        when(paymentMapper.toDto(payment)).thenReturn(dto);

        PaymentDTO result = paymentService.createPayment(dto);

        assertThat(result.getId()).isEqualTo(1L);
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void createPayment_OrderNotFound_Throws() {
        when(paymentMapper.toEntity(dto)).thenReturn(payment);
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.createPayment(dto))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("No order exists with id");
    }


    @Test
    void updatePayment_NotFound_Throws() {
        when(paymentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.updatePayment(99L, dto))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Payment not found");
    }

    @Test
    void deletePayment_Success() {
        when(paymentRepository.existsById(1L)).thenReturn(true);

        paymentService.deletePayment(1L);

        verify(paymentRepository).deleteById(1L);
    }

    @Test
    void deletePayment_NotFound_Throws() {
        when(paymentRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> paymentService.deletePayment(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Payment not found");
    }
}