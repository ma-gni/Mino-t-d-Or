package com.magnii.minotor.service;

import com.magnii.minotor.dto.PaymentDTO;
import com.magnii.minotor.mapper.PaymentMapper;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.Payment;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository     orderRepository;
    private final PaymentMapper       paymentMapper;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          PaymentMapper paymentMapper) {
        this.paymentRepository = paymentRepository;
        this.orderRepository   = orderRepository;
        this.paymentMapper     = paymentMapper;
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(paymentMapper::toDto)
                .collect(Collectors.toList());
    }

    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Payment not found with id " + id
                ));
        return paymentMapper.toDto(payment);
    }

    public PaymentDTO createPayment(PaymentDTO dto) {
        // map basic fields
        Payment payment = paymentMapper.toEntity(dto);

        // explicitly wire the Order FK
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "No order exists with id: " + dto.getOrderId()
                ));
        payment.setOrder(order);

        // now save
        Payment saved = paymentRepository.save(payment);
        return paymentMapper.toDto(saved);
    }

    public PaymentDTO updatePayment(Long id, PaymentDTO dto) {
        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Payment not found with id " + id
                ));

        // copy updatable fields
        existing.setAmount(dto.getAmount());
        existing.setPaymentDate(dto.getPaymentDate());
        existing.setStatus(Payment.PaymentStatus.valueOf(dto.getStatus()));

        // if the client also updated the orderId, re‐wire that as well:
        if (! existing.getOrder().getId().equals(dto.getOrderId())) {
            Order order = orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "No order exists with id: " + dto.getOrderId()
                    ));
            existing.setOrder(order);
        }

        Payment updated = paymentRepository.save(existing);
        return paymentMapper.toDto(updated);
    }

    public void deletePayment(Long id) {
        if (! paymentRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Payment not found with id: " + id
            );
        }
        paymentRepository.deleteById(id);
    }
}