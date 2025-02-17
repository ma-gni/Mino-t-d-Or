package com.magnii.minotor.service;

import com.magnii.minotor.dto.StockDTO;
import com.magnii.minotor.mapper.StockMapper;
import com.magnii.minotor.model.Stock;
import com.magnii.minotor.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final StockMapper stockMapper;

    public StockService(StockRepository stockRepository, StockMapper stockMapper) {
        this.stockRepository = stockRepository;
        this.stockMapper = stockMapper;
    }

    public List<StockDTO> getAllStocks() {
        List<Stock> stocks = stockRepository.findAll();
        return stockMapper.toDto(stocks);
    }

    public StockDTO getStockById(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with id: " + id));
        return stockMapper.toDto(stock);
    }

    public StockDTO createStock(StockDTO stockDTO) {
        Stock stock = stockMapper.toEntity(stockDTO);
        stock = stockRepository.save(stock);
        return stockMapper.toDto(stock);
    }

    public StockDTO updateStock(Long id, StockDTO stockDTO) {
        Stock existingStock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with id: " + id));
        existingStock.setQuantity(stockDTO.getQuantity());
        // Update associated product or warehouse if needed
        Stock updatedStock = stockRepository.save(existingStock);
        return stockMapper.toDto(updatedStock);
    }

    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }
}