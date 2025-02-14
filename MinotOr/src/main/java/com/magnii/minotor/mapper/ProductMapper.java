package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.ProductDTO;
import com.magnii.minotor.model.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {SupplierMapper.class, CategoryMapper.class})
public interface ProductMapper extends EntityMapper<ProductDTO, Product> {
}