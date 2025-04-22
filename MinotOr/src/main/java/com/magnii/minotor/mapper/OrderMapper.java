package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.OrderDTO;
import com.magnii.minotor.model.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {
        UserMapper.class,
        OrderDetailMapper.class,
        PaymentMapper.class,
        DeliveryMapper.class
})
public interface OrderMapper extends EntityMapper<OrderDTO, Order> {
}