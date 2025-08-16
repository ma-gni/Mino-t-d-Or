package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.QuoteDTO;
import com.magnii.minotor.model.Quote;
import com.magnii.minotor.model.QuoteItem;
import org.mapstruct.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Mapper(componentModel = "spring", uses = { QuoteItemMapper.class })
public interface QuoteMapper {

    @Mapping(target = "userId",              source = "user.id")
    @Mapping(target = "status",              expression = "java(quote.getStatus().name())")
    @Mapping(target = "accepted",            source = "accepted")
    @Mapping(target = "discountPercent",     source = "discountPercent")
    @Mapping(target = "adminComment",        source = "adminComment")
    @Mapping(target = "decisionDate",        source = "decisionDate")
    @Mapping(target = "approvedByUserId",    source = "approvedBy.id")
    @Mapping(target = "items",               source = "items")
    // computed after mapping:
    @Mapping(target = "totalHtBeforeDiscount", ignore = true)
    @Mapping(target = "totalHtAfterDiscount",  ignore = true)
    QuoteDTO toDto(Quote quote);

    @AfterMapping
    default void computeTotals(Quote quote, @MappingTarget QuoteDTO dto) {
        BigDecimal total = BigDecimal.ZERO;
        if (quote.getItems() != null) {
            for (QuoteItem it : quote.getItems()) {
                BigDecimal unit = (it.getProduct() != null && it.getProduct().getPrice() != null)
                        ? it.getProduct().getPrice()
                        : BigDecimal.ZERO;
                BigDecimal line = unit.multiply(BigDecimal.valueOf(it.getQuantity()));
                total = total.add(line);
            }
        }
        total = total.setScale(2, RoundingMode.HALF_UP);
        dto.setTotalHtBeforeDiscount(total);

        BigDecimal d = quote.getDiscountPercent() != null ? quote.getDiscountPercent() : BigDecimal.ZERO;
        BigDecimal after = total.multiply(
                BigDecimal.ONE.subtract(d.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP))
        );
        dto.setTotalHtAfterDiscount(after.setScale(2, RoundingMode.HALF_UP));
    }
}