package com.magnii.minotor.service;

import com.magnii.minotor.dto.WarehouseDTO;
import com.magnii.minotor.mapper.WarehouseMapper;
import com.magnii.minotor.model.Warehouse;
import com.magnii.minotor.repository.WarehouseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;

    public WarehouseService(WarehouseRepository warehouseRepository, WarehouseMapper warehouseMapper) {
        this.warehouseRepository = warehouseRepository;
        this.warehouseMapper = warehouseMapper;
    }

    public List<WarehouseDTO> getAllWarehouses() {
        List<Warehouse> warehouses = warehouseRepository.findAll();
        return warehouseMapper.toDto(warehouses);
    }

    public WarehouseDTO getWarehouseById(Long id) {
        return warehouseRepository.findById(id)
                .map(warehouseMapper::toDto)
                .orElse(null);
    }

    public WarehouseDTO createWarehouse(WarehouseDTO warehouseDTO) {
        Warehouse warehouse = warehouseMapper.toEntity(warehouseDTO);
        warehouse = warehouseRepository.save(warehouse);
        return warehouseMapper.toDto(warehouse);
    }

    public WarehouseDTO updateWarehouse(Long id, WarehouseDTO warehouseDTO) {
        Warehouse existingWarehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + id));
        existingWarehouse.setName(warehouseDTO.getName());
        existingWarehouse.setLocation(warehouseDTO.getLocation());
        // Update stocks if needed
        Warehouse updatedWarehouse = warehouseRepository.save(existingWarehouse);
        return warehouseMapper.toDto(updatedWarehouse);
    }
    public boolean deleteWarehouse(Long id) {
        if (warehouseRepository.existsById(id)) {
            warehouseRepository.deleteById(id);
            return true;
        }
        return false;
    }

}