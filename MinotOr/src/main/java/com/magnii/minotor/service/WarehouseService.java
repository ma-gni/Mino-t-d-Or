package com.magnii.minotor.service;

import com.magnii.minotor.dto.WarehouseDTO;
import com.magnii.minotor.mapper.WarehouseMapper;
import com.magnii.minotor.model.Warehouse;
import com.magnii.minotor.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;

    public WarehouseService(WarehouseRepository warehouseRepository,
                            WarehouseMapper warehouseMapper) {
        this.warehouseRepository = warehouseRepository;
        this.warehouseMapper = warehouseMapper;
    }

    public List<WarehouseDTO> getAllWarehouses() {
        return warehouseMapper.toDto(warehouseRepository.findAll());
    }

    public WarehouseDTO getWarehouseById(Long id) {
        return warehouseRepository.findById(id)
                .map(warehouseMapper::toDto)
                .orElse(null);
    }

    public WarehouseDTO createWarehouse(WarehouseDTO warehouseDTO) {
        Warehouse entity = warehouseMapper.toEntity(warehouseDTO);
        return warehouseMapper.toDto(warehouseRepository.save(entity));
    }

    public WarehouseDTO updateWarehouse(Long id, WarehouseDTO warehouseDTO) {
        return warehouseRepository.findById(id)
                .map(existing -> {
                    existing.setName(warehouseDTO.getName());
                    existing.setLocation(warehouseDTO.getLocation());
                    return warehouseMapper.toDto(warehouseRepository.save(existing));
                })
                .orElse(null);
    }

    public boolean deleteWarehouse(Long id) {
        if (!warehouseRepository.existsById(id)) {
            return false;
        }
        warehouseRepository.deleteById(id);
        return true;
    }
}