package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.QuoteItemDTO;
import com.magnii.minotor.model.QuoteItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuoteItemMapper {

    @Mapping(target = "productId",   source = "product.id")
    @Mapping(target = "productName", source = "product.name") // ← if your field is 'nom', use product.nom
    @Mapping(target = "unitPriceHt", source = "product.price")
    QuoteItemDTO toDto(QuoteItem item);
}