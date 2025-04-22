package com.magnii.minotor;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.mapper.DeliveryMapper;
import com.magnii.minotor.model.Delivery;
import com.magnii.minotor.repository.DeliveryRepository;
import com.magnii.minotor.service.DeliveryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DeliveryServiceTest {

    @Mock
    private DeliveryRepository deliveryRepository;

    @Mock
    private DeliveryMapper deliveryMapper;

    @InjectMocks
    private DeliveryService deliveryService;

    @Test
    public void testGetDeliveryById_Success() {
        Long deliveryId = 1L;
        Delivery delivery = new Delivery();
        delivery.setId(deliveryId);
        // Set additional fields as needed

        DeliveryDTO deliveryDTO = new DeliveryDTO();
        deliveryDTO.setId(deliveryId);
        // Set additional fields as needed

        when(deliveryRepository.findById(deliveryId)).thenReturn(Optional.of(delivery));
        when(deliveryMapper.toDto(delivery)).thenReturn(deliveryDTO);

        DeliveryDTO result = deliveryService.getDeliveryById(deliveryId);
        assertNotNull(result);
        assertEquals(deliveryId, result.getId());
        verify(deliveryRepository, times(1)).findById(deliveryId);
    }
}