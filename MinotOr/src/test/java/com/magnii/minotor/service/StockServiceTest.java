package com.magnii.minotor.service;

import com.magnii.minotor.dto.StockDTO;
import com.magnii.minotor.mapper.StockMapper;
import com.magnii.minotor.model.Product;
import com.magnii.minotor.model.Stock;
import com.magnii.minotor.model.Warehouse;
import com.magnii.minotor.repository.ProductRepository;
import com.magnii.minotor.repository.StockRepository;
import com.magnii.minotor.repository.WarehouseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockServiceTest {

    @Mock private StockRepository stockRepository;
    @Mock private ProductRepository productRepository;
    @Mock private WarehouseRepository warehouseRepository;
    @Mock private StockMapper stockMapper;

    @InjectMocks
    private StockService stockService;

    @BeforeEach
    void setUp() {
        // Force inject mocks into @Autowired fields
        ReflectionTestUtils.setField(stockService, "productRepository", productRepository);
        ReflectionTestUtils.setField(stockService, "warehouseRepository", warehouseRepository);
    }

    @Test
    void createStock_SavesSuccessfully() {
        StockDTO dto = new StockDTO();
        dto.setProductId(1L);
        dto.setWarehouseId(2L);
        dto.setQuantity(10);

        Product product = new Product();
        product.setId(1L);

        Warehouse warehouse = new Warehouse();
        warehouse.setId(2L);

        Stock stock = new Stock();
        stock.setId(99L);
        stock.setProduct(product);
        stock.setWarehouse(warehouse);
        stock.setQuantity(10);

        StockDTO expectedDto = new StockDTO();
        expectedDto.setId(99L);
        expectedDto.setProductId(1L);
        expectedDto.setWarehouseId(2L);
        expectedDto.setQuantity(10);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(warehouseRepository.findById(2L)).thenReturn(Optional.of(warehouse));
        when(stockRepository.save(any(Stock.class))).thenReturn(stock);
        when(stockMapper.toDto(any(Stock.class))).thenReturn(expectedDto);

        StockDTO result = stockService.createStock(dto);

        assertThat(result.getId()).isEqualTo(99L);
        assertThat(result.getQuantity()).isEqualTo(10);
        verify(stockRepository, times(1)).save(any(Stock.class));
    }
}