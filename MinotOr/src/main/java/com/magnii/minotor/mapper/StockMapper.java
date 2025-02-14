package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.StockDTO;
import com.magnii.minotor.model.Stock;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ProductMapper.class, WarehouseMapper.class})
public interface StockMapper extends EntityMapper<StockDTO, Stock> {
}