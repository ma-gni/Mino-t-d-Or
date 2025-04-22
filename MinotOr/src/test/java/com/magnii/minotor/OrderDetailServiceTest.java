package com.magnii.minotor;

import com.magnii.minotor.dto.OrderDetailDTO;
import com.magnii.minotor.mapper.OrderDetailMapper;
import com.magnii.minotor.model.OrderDetail;
import com.magnii.minotor.repository.OrderDetailRepository;
import com.magnii.minotor.service.OrderDetailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderDetailServiceTest {

    @Mock
    private OrderDetailRepository orderDetailRepository;

    @Mock
    private OrderDetailMapper orderDetailMapper;

    @InjectMocks
    private OrderDetailService orderDetailService;

    @Test
    public void testGetOrderDetailById_Success() {
        Long detailId = 1L;
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setId(detailId);
        // Set additional fields as needed

        OrderDetailDTO orderDetailDTO = new OrderDetailDTO();
        orderDetailDTO.setId(detailId);
        // Set additional fields as needed

        when(orderDetailRepository.findById(detailId)).thenReturn(Optional.of(orderDetail));
        when(orderDetailMapper.toDto(orderDetail)).thenReturn(orderDetailDTO);

        OrderDetailDTO result = orderDetailService.getOrderDetailById(detailId);
        assertNotNull(result);
        assertEquals(detailId, result.getId());
        verify(orderDetailRepository, times(1)).findById(detailId);
    }
}