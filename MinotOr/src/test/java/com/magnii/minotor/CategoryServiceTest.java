package com.magnii.minotor;

import com.magnii.minotor.dto.CategoryDTO;
import com.magnii.minotor.mapper.CategoryMapper;
import com.magnii.minotor.model.Category;
import com.magnii.minotor.repository.CategoryRepository;
import com.magnii.minotor.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    public void testGetCategoryById_Success() {
        Long categoryId = 1L;
        Category category = new Category();
        category.setId(categoryId);
        category.setName("Electronics");

        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setId(categoryId);
        categoryDTO.setName("Electronics");

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(categoryMapper.toDto(category)).thenReturn(categoryDTO);

        CategoryDTO result = categoryService.getCategoryById(categoryId);
        assertNotNull(result);
        assertEquals(categoryId, result.getId());
        verify(categoryRepository, times(1)).findById(categoryId);
    }
}