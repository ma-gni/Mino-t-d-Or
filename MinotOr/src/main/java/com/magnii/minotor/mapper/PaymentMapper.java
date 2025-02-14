package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.PaymentDTO;
import com.magnii.minotor.model.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {OrderMapper.class})
public interface PaymentMapper extends EntityMapper<PaymentDTO, Payment> {
}