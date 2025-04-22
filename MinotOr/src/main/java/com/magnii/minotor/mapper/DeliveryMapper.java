package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.model.Delivery;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {OrderMapper.class})
public interface DeliveryMapper extends EntityMapper<DeliveryDTO, Delivery> {
}