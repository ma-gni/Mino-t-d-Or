package com.magnii.minotor;

import com.magnii.minotor.dto.SupplierDTO;
import com.magnii.minotor.mapper.SupplierMapper;
import com.magnii.minotor.model.Supplier;
import com.magnii.minotor.repository.SupplierRepository;
import com.magnii.minotor.service.SupplierService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;

    @Mock
    private SupplierMapper supplierMapper;

    @InjectMocks
    private SupplierService supplierService;

    @Test
    public void testGetSupplierById_Success() {
        Long supplierId = 1L;
        Supplier supplier = new Supplier();
        supplier.setId(supplierId);
        supplier.setName("Supplier A");

        SupplierDTO supplierDTO = new SupplierDTO();
        supplierDTO.setId(supplierId);
        supplierDTO.setName("Supplier A");

        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(supplierMapper.toDto(supplier)).thenReturn(supplierDTO);

        SupplierDTO result = supplierService.getSupplierById(supplierId);
        assertNotNull(result);
        assertEquals(supplierId, result.getId());
        verify(supplierRepository, times(1)).findById(supplierId);
    }
}