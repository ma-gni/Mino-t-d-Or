package com.magnii.minotor.service;

import com.magnii.minotor.dto.CategoryDTO;
import com.magnii.minotor.exception.ResourceNotFoundException;
import com.magnii.minotor.mapper.CategoryMapper;
import com.magnii.minotor.model.Category;
import com.magnii.minotor.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository,
                           CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryMapper.toDto(categoryRepository.findAll());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return categoryMapper.toDto(cat);
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        Category saved = categoryRepository.save(categoryMapper.toEntity(dto));
        return categoryMapper.toDto(saved);
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        return categoryMapper.toDto(categoryRepository.save(existing));
    }

    public void deleteCategory(Long id) {
        // throw 404 if not present
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}