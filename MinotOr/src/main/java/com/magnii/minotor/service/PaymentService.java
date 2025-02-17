package com.magnii.minotor.service;

import com.magnii.minotor.dto.PaymentDTO;
import com.magnii.minotor.mapper.PaymentMapper;
import com.magnii.minotor.model.Payment;
import com.magnii.minotor.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;

    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
    }

    public List<PaymentDTO> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return paymentMapper.toDto(payments);
    }

    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return paymentMapper.toDto(payment);
    }

    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Payment payment = paymentMapper.toEntity(paymentDTO);
        payment = paymentRepository.save(payment);
        return paymentMapper.toDto(payment);
    }

    public PaymentDTO updatePayment(Long id, PaymentDTO paymentDTO) {
        Payment existingPayment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        existingPayment.setAmount(paymentDTO.getAmount());
        existingPayment.setPaymentDate(paymentDTO.getPaymentDate());
        existingPayment.setStatus(Payment.PaymentStatus.valueOf(paymentDTO.getStatus().toUpperCase()));
        Payment updatedPayment = paymentRepository.save(existingPayment);
        return paymentMapper.toDto(updatedPayment);
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}