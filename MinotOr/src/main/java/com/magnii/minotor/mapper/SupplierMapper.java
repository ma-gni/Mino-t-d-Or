package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.SupplierDTO;
import com.magnii.minotor.model.Supplier;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface SupplierMapper extends EntityMapper<SupplierDTO, Supplier> {
}