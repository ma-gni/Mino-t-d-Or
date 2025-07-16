package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.QuoteDTO;
import com.magnii.minotor.model.Quote;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {QuoteItemMapper.class})
public interface QuoteMapper {

    @Mapping(source = "user.id", target = "userId")
    QuoteDTO toDto(Quote quote);

    @Mapping(source = "userId", target = "user.id")
    Quote toEntity(QuoteDTO dto);
}