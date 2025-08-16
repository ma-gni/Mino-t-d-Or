package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.QuoteItemDTO;
import com.magnii.minotor.model.QuoteItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuoteItemMapper {

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "quantity",  source = "quantity")
    QuoteItemDTO toDto(QuoteItem item);

}