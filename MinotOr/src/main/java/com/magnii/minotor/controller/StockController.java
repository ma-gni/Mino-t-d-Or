package com.magnii.minotor.controller;

import com.magnii.minotor.dto.StockDTO;
import com.magnii.minotor.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService){
        this.stockService = stockService;
    }

    @GetMapping
    public ResponseEntity<List<StockDTO>> getAllStocks(){
        List<StockDTO> stocks = stockService.getAllStocks();
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockDTO> getStockById(@PathVariable Long id){
        StockDTO dto = stockService.getStockById(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<StockDTO> createStock(@RequestBody StockDTO dto){
        StockDTO createdDto = stockService.createStock(dto);
        return ResponseEntity.ok(createdDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockDTO> updateStock(@PathVariable Long id, @RequestBody StockDTO dto){
        StockDTO updatedDto = stockService.updateStock(id, dto);
        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id){
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }
}