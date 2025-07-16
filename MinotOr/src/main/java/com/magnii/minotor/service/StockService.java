package com.magnii.minotor.service;

import com.magnii.minotor.dto.StockDTO;
import com.magnii.minotor.mapper.StockMapper;
import com.magnii.minotor.model.Product;
import com.magnii.minotor.model.Stock;
import com.magnii.minotor.model.Warehouse;
import com.magnii.minotor.repository.ProductRepository;
import com.magnii.minotor.repository.StockRepository;
import com.magnii.minotor.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final StockMapper stockMapper;
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;
    public StockService(StockRepository stockRepository, StockMapper stockMapper) {
        this.stockRepository = stockRepository;
        this.stockMapper = stockMapper;
    }

    public List<StockDTO> getAllStocks() {
        List<Stock> stocks = stockRepository.findAll();
        return stocks.stream()
                .map(stockMapper::toDto)
                .toList();
    }

    public StockDTO getStockById(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Stock not found with id: " + id));
        return stockMapper.toDto(stock);
    }

    public StockDTO createStock(StockDTO stockDTO) {
        Stock stock = new Stock();

        Product product = productRepository.findById(stockDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Warehouse warehouse = warehouseRepository.findById(stockDTO.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        stock.setProduct(product);
        stock.setWarehouse(warehouse);
        stock.setQuantity(stockDTO.getQuantity());

        Stock saved = stockRepository.save(stock);
        return stockMapper.toDto(saved);
    }

    public StockDTO updateStock(Long id, StockDTO stockDTO) {
        Stock existingStock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with id: " + id));

        existingStock.setQuantity(stockDTO.getQuantity());

        if (stockDTO.getProductId() != null) {
            Product product = productRepository.findById(stockDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            existingStock.setProduct(product);
        }

        if (stockDTO.getWarehouseId() != null) {
            Warehouse warehouse = warehouseRepository.findById(stockDTO.getWarehouseId())
                    .orElseThrow(() -> new RuntimeException("Warehouse not found"));
            existingStock.setWarehouse(warehouse);
        }

        Stock updatedStock = stockRepository.save(existingStock);
        return stockMapper.toDto(updatedStock);
    }

    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }
}