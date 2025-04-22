package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.WarehouseDTO;
import com.magnii.minotor.model.Warehouse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {StockMapper.class})
public interface WarehouseMapper extends EntityMapper<WarehouseDTO, Warehouse> {
}