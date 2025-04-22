package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.CategoryDTO;
import com.magnii.minotor.model.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface CategoryMapper extends EntityMapper<CategoryDTO, Category> {
}