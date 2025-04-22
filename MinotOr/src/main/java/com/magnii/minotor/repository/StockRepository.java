package com.magnii.minotor.repository;

import com.magnii.minotor.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByProductId(Long productId);
    List<Stock> findByWarehouseId(Long warehouseId);
}