package com.magnii.minotor.controller;

import com.magnii.minotor.dto.WarehouseDTO;
import com.magnii.minotor.service.WarehouseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService){
        this.warehouseService = warehouseService;
    }

    // ✅ Get all warehouses
    @GetMapping
    public ResponseEntity<List<WarehouseDTO>> getAllWarehouses(){
        List<WarehouseDTO> warehouses = warehouseService.getAllWarehouses();
        return ResponseEntity.ok(warehouses);
    }

    // ✅ Get a warehouse by ID, return 404 if not found
    @GetMapping("/{id}")
    public ResponseEntity<WarehouseDTO> getWarehouseById(@PathVariable Long id){
        WarehouseDTO dto = warehouseService.getWarehouseById(id);
        return (dto != null) ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    // ✅ Create new warehouse
    @PostMapping
    public ResponseEntity<WarehouseDTO> createWarehouse(@RequestBody WarehouseDTO dto){
        WarehouseDTO createdDto = warehouseService.createWarehouse(dto);
        return ResponseEntity.ok(createdDto);
    }

    // ✅ Update warehouse, return 404 if not found
    @PutMapping("/{id}")
    public ResponseEntity<WarehouseDTO> updateWarehouse(@PathVariable Long id, @RequestBody WarehouseDTO dto){
        WarehouseDTO updatedDto = warehouseService.updateWarehouse(id, dto);
        return (updatedDto != null) ? ResponseEntity.ok(updatedDto) : ResponseEntity.notFound().build();
    }

    // ✅ Delete warehouse
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable Long id){
        boolean deleted = warehouseService.deleteWarehouse(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}