package com.magnii.minotor;

import com.magnii.minotor.dto.StockDTO;
import com.magnii.minotor.mapper.StockMapper;
import com.magnii.minotor.model.Stock;
import com.magnii.minotor.repository.StockRepository;
import com.magnii.minotor.service.StockService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StockServiceTest {

    @Mock
    private StockRepository stockRepository;

    @Mock
    private StockMapper stockMapper;

    @InjectMocks
    private StockService stockService;

    @Test
    public void testGetStockById_Success() {
        Long stockId = 1L;
        Stock stock = new Stock();
        stock.setId(stockId);
        // Set additional fields as needed

        StockDTO stockDTO = new StockDTO();
        stockDTO.setId(stockId);
        // Set additional fields as needed

        when(stockRepository.findById(stockId)).thenReturn(Optional.of(stock));
        when(stockMapper.toDto(stock)).thenReturn(stockDTO);

        StockDTO result = stockService.getStockById(stockId);
        assertNotNull(result);
        assertEquals(stockId, result.getId());
        verify(stockRepository, times(1)).findById(stockId);
    }
}