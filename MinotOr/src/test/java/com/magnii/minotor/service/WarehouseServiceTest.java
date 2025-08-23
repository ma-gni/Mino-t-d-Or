package com.magnii.minotor.service;

import com.magnii.minotor.dto.WarehouseDTO;
import com.magnii.minotor.mapper.WarehouseMapper;
import com.magnii.minotor.model.Warehouse;
import com.magnii.minotor.repository.WarehouseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class WarehouseServiceTest {

    private WarehouseRepository repo;
    private WarehouseMapper mapper;
    private WarehouseService service;

    @BeforeEach
    void setup() {
        repo = mock(WarehouseRepository.class);
        mapper = mock(WarehouseMapper.class);
        service = new WarehouseService(repo, mapper);
    }

    @Test
    void getAllWarehouses_returnsMappedList() {
        var entities = List.of(new Warehouse(1L, "A", "X", null),
                new Warehouse(2L, "B", "Y", null));
        var dtos = List.of(dto(1L, "A", "X"), dto(2L, "B", "Y"));

        when(repo.findAll()).thenReturn(entities);
        when(mapper.toDto(entities)).thenReturn(dtos);

        var result = service.getAllWarehouses();
        assertThat(result).containsExactlyElementsOf(dtos);
    }

    @Test
    void getWarehouseById_found_returnsDto() {
        var entity = new Warehouse(10L, "Main", "Paris", null);
        var dto = dto(10L, "Main", "Paris");

        when(repo.findById(10L)).thenReturn(Optional.of(entity));
        when(mapper.toDto(entity)).thenReturn(dto);

        var result = service.getWarehouseById(10L);
        assertThat(result).isEqualTo(dto);
    }

    @Test
    void getWarehouseById_notFound_returnsNull() {
        when(repo.findById(99L)).thenReturn(Optional.empty());
        var result = service.getWarehouseById(99L);
        assertThat(result).isNull();
    }

    @Test
    void createWarehouse_mapsAndSaves() {
        var input = dto(null, "New", "Nice");
        var entityToSave = new Warehouse(null, "New", "Nice", null);
        var saved = new Warehouse(5L, "New", "Nice", null);
        var output = dto(5L, "New", "Nice");

        when(mapper.toEntity(input)).thenReturn(entityToSave);
        when(repo.save(entityToSave)).thenReturn(saved);
        when(mapper.toDto(saved)).thenReturn(output);

        var result = service.createWarehouse(input);

        assertThat(result).isEqualTo(output);
        verify(repo).save(entityToSave);
    }

    @Test
    void updateWarehouse_found_updatesAndReturnsDto() {
        var existing = new Warehouse(7L, "Old", "Lyon", null);
        var dtoUpdate = dto(null, "Updated", "Marseille");
        var saved = new Warehouse(7L, "Updated", "Marseille", null);
        var mapped = dto(7L, "Updated", "Marseille");

        when(repo.findById(7L)).thenReturn(Optional.of(existing));
        when(repo.save(any(Warehouse.class))).thenReturn(saved);
        when(mapper.toDto(saved)).thenReturn(mapped);

        var result = service.updateWarehouse(7L, dtoUpdate);

        assertThat(result).isEqualTo(mapped);
        ArgumentCaptor<Warehouse> captor = ArgumentCaptor.forClass(Warehouse.class);
        verify(repo).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("Updated");
        assertThat(captor.getValue().getLocation()).isEqualTo("Marseille");
    }

    @Test
    void updateWarehouse_notFound_returnsNull() {
        when(repo.findById(123L)).thenReturn(Optional.empty());
        var result = service.updateWarehouse(123L, dto(null, "N", "L"));
        assertThat(result).isNull();
        verify(repo, never()).save(any());
    }

    @Test
    void deleteWarehouse_existing_returnsTrue() {
        when(repo.existsById(3L)).thenReturn(true);
        var ok = service.deleteWarehouse(3L);
        assertThat(ok).isTrue();
        verify(repo).deleteById(3L);
    }

    @Test
    void deleteWarehouse_missing_returnsFalse() {
        when(repo.existsById(4L)).thenReturn(false);
        var ok = service.deleteWarehouse(4L);
        assertThat(ok).isFalse();
        verify(repo, never()).deleteById(any());
    }

    private static WarehouseDTO dto(Long id, String name, String location) {
        var d = new WarehouseDTO();
        d.setId(id);
        d.setName(name);
        d.setLocation(location);
        return d;
    }
}