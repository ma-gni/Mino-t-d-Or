// SupplierService.java
package com.magnii.minotor.service;

import com.magnii.minotor.dto.SupplierDTO;
import com.magnii.minotor.mapper.SupplierMapper;
import com.magnii.minotor.model.Supplier;
import com.magnii.minotor.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    public SupplierService(SupplierRepository supplierRepository,
                           SupplierMapper supplierMapper) {
        this.supplierRepository = supplierRepository;
        this.supplierMapper = supplierMapper;
    }

    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(supplierMapper::toDto)
                .collect(Collectors.toList());
    }

    /** NEW: throws if not found */
    public SupplierDTO getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .map(supplierMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    public SupplierDTO createSupplier(SupplierDTO dto) {
        Supplier toSave = supplierMapper.toEntity(dto);
        Supplier saved = supplierRepository.save(toSave);
        return supplierMapper.toDto(saved);
    }

    public SupplierDTO updateSupplier(Long id, SupplierDTO dto) {
        Supplier existing = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        existing.setName(dto.getName());
        existing.setContactInfo(dto.getContactInfo());
        Supplier updated = supplierRepository.save(existing);
        return supplierMapper.toDto(updated);
    }

    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found with id: " + id);
        }
        supplierRepository.deleteById(id);
    }
}