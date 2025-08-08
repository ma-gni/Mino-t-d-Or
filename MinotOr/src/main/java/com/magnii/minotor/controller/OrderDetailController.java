package com.magnii.minotor.controller;

import com.magnii.minotor.dto.OrderDetailDTO;
import com.magnii.minotor.service.OrderDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {

    private final OrderDetailService orderDetailService;

    public OrderDetailController(OrderDetailService orderDetailService){
        this.orderDetailService = orderDetailService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> getOrderDetailById(@PathVariable Long id){
        OrderDetailDTO dto = orderDetailService.getOrderDetailById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetailDTO>> getOrderDetailsByOrderId(@PathVariable Long orderId){
        List<OrderDetailDTO> details = orderDetailService.getOrderDetailsByOrderId(orderId);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<OrderDetailDTO>> getOrderDetailsByProductId(@PathVariable Long productId){
        List<OrderDetailDTO> details = orderDetailService.getOrderDetailsByProductId(productId);
        return ResponseEntity.ok(details);
    }

    @PostMapping
    public ResponseEntity<OrderDetailDTO> createOrderDetail(@RequestBody OrderDetailDTO dto){
        OrderDetailDTO createdDto = orderDetailService.createOrderDetail(dto);
        return ResponseEntity.ok(createdDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> updateOrderDetail(@PathVariable Long id, @RequestBody OrderDetailDTO dto){
        OrderDetailDTO updatedDto = orderDetailService.updateOrderDetail(id, dto);
        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long id){
        orderDetailService.deleteOrderDetail(id);
        return ResponseEntity.noContent().build();
    }
}