package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.PaymentDTO;
import com.magnii.minotor.model.Payment;
import com.magnii.minotor.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentMapper INSTANCE = Mappers.getMapper(PaymentMapper.class);

    @Mapping(source = "order.id", target = "orderId")
    PaymentDTO toDto(Payment payment);

    /**
     * We ignore mapping the whole Order here because the service
     * explicitly looks up the Order entity and wires it in.
     */
    @Mapping(target = "order", ignore = true)
    Payment toEntity(PaymentDTO dto);
}