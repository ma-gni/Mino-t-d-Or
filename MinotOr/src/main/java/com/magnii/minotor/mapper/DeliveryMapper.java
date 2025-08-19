package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.model.Delivery;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DeliveryMapper {
    DeliveryDTO toDto(Delivery delivery);
    Delivery toEntity(DeliveryDTO dto);
}