package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.OrderDetailDTO;
import com.magnii.minotor.model.OrderDetail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {OrderMapper.class, ProductMapper.class})
public interface OrderDetailMapper extends EntityMapper<OrderDetailDTO, OrderDetail> {
}