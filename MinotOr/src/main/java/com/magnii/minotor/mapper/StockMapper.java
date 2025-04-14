package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.StockDTO;
import com.magnii.minotor.model.Product;
import com.magnii.minotor.model.Stock;
import com.magnii.minotor.model.Warehouse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface StockMapper {

    @Mappings({
            @Mapping(source = "product.id", target = "productId"),
            @Mapping(source = "warehouse.id", target = "warehouseId")
    })
    StockDTO toDto(Stock stock);

    @Mappings({
            @Mapping(target = "product", expression = "java(mapProductId(stockDTO.getProductId()))"),
            @Mapping(target = "warehouse", expression = "java(mapWarehouseId(stockDTO.getWarehouseId()))")
    })
    Stock toEntity(StockDTO stockDTO);

    // Manual mapping for product and warehouse from ID
    default Product mapProductId(Long id) {
        if (id == null) return null;
        Product product = new Product();
        product.setId(id);
        return product;
    }

    default Warehouse mapWarehouseId(Long id) {
        if (id == null) return null;
        Warehouse warehouse = new Warehouse();
        warehouse.setId(id);
        return warehouse;
    }
}