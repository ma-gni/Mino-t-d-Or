package com.magnii.minotor.repository;

import com.magnii.minotor.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    List<Warehouse> findByLocationContaining(String location);
    Warehouse findByName(String name);
}