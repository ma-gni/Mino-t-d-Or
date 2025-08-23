package com.magnii.minotor.service;

import com.magnii.minotor.dto.CategoryDTO;
import com.magnii.minotor.exception.ResourceNotFoundException;
import com.magnii.minotor.mapper.CategoryMapper;
import com.magnii.minotor.model.Category;
import com.magnii.minotor.repository.CategoryRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock private CategoryRepository categoryRepository;
    @Mock private CategoryMapper categoryMapper;

    @InjectMocks private CategoryService categoryService;

    private Category entity(Long id, String name, String desc) {
        Category c = new Category();
        c.setId(id);
        c.setName(name);
        c.setDescription(desc);
        return c;
    }

    private CategoryDTO dto(Long id, String name, String desc) {
        CategoryDTO d = new CategoryDTO();
        d.setId(id);
        d.setName(name);
        d.setDescription(desc);
        return d;
    }


    @Test
    @DisplayName("getCategoryById -> 200 when found")
    void getById_found() {
        var e = entity(10L, "Music", "All music");
        when(categoryRepository.findById(10L)).thenReturn(Optional.of(e));
        when(categoryMapper.toDto(e)).thenReturn(dto(10L, "Music", "All music"));

        var result = categoryService.getCategoryById(10L);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("Music");
    }

    @Test
    @DisplayName("getCategoryById -> throws 404 when missing")
    void getById_notFound() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> categoryService.getCategoryById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("createCategory -> saves entity and returns DTO")
    void createCategory_saves() {
        var in = dto(null, "Electronics", "Gadgets");
        var toSave = entity(null, "Electronics", "Gadgets");
        var saved = entity(7L, "Electronics", "Gadgets");
        var out = dto(7L, "Electronics", "Gadgets");

        when(categoryMapper.toEntity(in)).thenReturn(toSave);
        when(categoryRepository.save(toSave)).thenReturn(saved);
        when(categoryMapper.toDto(saved)).thenReturn(out);

        CategoryDTO result = categoryService.createCategory(in);

        assertThat(result.getId()).isEqualTo(7L);
        verify(categoryRepository).save(toSave);
    }

    @Test
    @DisplayName("updateCategory -> updates fields and returns DTO")
    void updateCategory_found() {
        var existing = entity(5L, "Old", "Old desc");
        var payload = dto(null, "New", "New desc");
        var saved = entity(5L, "New", "New desc");
        var out = dto(5L, "New", "New desc");

        when(categoryRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(categoryRepository.save(existing)).thenReturn(saved);
        when(categoryMapper.toDto(saved)).thenReturn(out);

        CategoryDTO result = categoryService.updateCategory(5L, payload);

        assertThat(result.getName()).isEqualTo("New");
        assertThat(existing.getName()).isEqualTo("New");
        verify(categoryRepository).save(existing);
    }

    @Test
    @DisplayName("updateCategory -> throws 404 when missing")
    void updateCategory_notFound() {
        when(categoryRepository.findById(404L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> categoryService.updateCategory(404L, dto(null, "X", "Y")))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("deleteCategory -> deletes when exists")
    void deleteCategory_found() {
        when(categoryRepository.existsById(3L)).thenReturn(true);

        categoryService.deleteCategory(3L);

        verify(categoryRepository).deleteById(3L);
    }

    @Test
    @DisplayName("deleteCategory -> throws 404 when missing")
    void deleteCategory_notFound() {
        when(categoryRepository.existsById(123L)).thenReturn(false);

        assertThatThrownBy(() -> categoryService.deleteCategory(123L))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(categoryRepository, never()).deleteById(anyLong());
    }
}