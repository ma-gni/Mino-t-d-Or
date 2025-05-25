package com.magnii.minotor.service;

import com.magnii.minotor.dto.WarehouseDTO;
import com.magnii.minotor.mapper.WarehouseMapper;
import com.magnii.minotor.model.Warehouse;
import com.magnii.minotor.repository.WarehouseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WarehouseServiceTest {

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private WarehouseMapper warehouseMapper;

    @InjectMocks
    private WarehouseService warehouseService;

    @Test
    public void testGetWarehouseById_Success() {
        Long warehouseId = 1L;
        Warehouse warehouse = new Warehouse();
        warehouse.setId(warehouseId);
        warehouse.setName("Main Warehouse");
        warehouse.setLocation("Location A");

        WarehouseDTO warehouseDTO = new WarehouseDTO();
        warehouseDTO.setId(warehouseId);
        warehouseDTO.setName("Main Warehouse");
        warehouseDTO.setLocation("Location A");

        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.of(warehouse));
        when(warehouseMapper.toDto(warehouse)).thenReturn(warehouseDTO);

        WarehouseDTO result = warehouseService.getWarehouseById(warehouseId);
        assertNotNull(result);
        assertEquals(warehouseId, result.getId());
        verify(warehouseRepository, times(1)).findById(warehouseId);
    }
}