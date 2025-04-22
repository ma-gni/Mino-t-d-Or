package com.magnii.minotor;

import com.magnii.minotor.dto.PaymentDTO;
import com.magnii.minotor.mapper.PaymentMapper;
import com.magnii.minotor.model.Payment;
import com.magnii.minotor.repository.PaymentRepository;
import com.magnii.minotor.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentMapper paymentMapper;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    public void testGetPaymentById_Success() {
        Long paymentId = 1L;
        Payment payment = new Payment();
        payment.setId(paymentId);
        // Set additional fields as needed

        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setId(paymentId);
        // Set additional fields as needed

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(payment));
        when(paymentMapper.toDto(payment)).thenReturn(paymentDTO);

        PaymentDTO result = paymentService.getPaymentById(paymentId);
        assertNotNull(result);
        assertEquals(paymentId, result.getId());
        verify(paymentRepository, times(1)).findById(paymentId);
    }
}