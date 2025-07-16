package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.QuoteItemDTO;
import com.magnii.minotor.model.QuoteItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuoteItemMapper {

    @Mapping(source = "product.id", target = "productId")
    QuoteItemDTO toDto(QuoteItem quoteItem);

    @Mapping(source = "productId", target = "product.id")
    QuoteItem toEntity(QuoteItemDTO dto);
}