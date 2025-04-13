package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.FeedbackDTO;
import com.magnii.minotor.model.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FeedbackMapper extends EntityMapper<FeedbackDTO, Feedback> {
    @Override
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "order.id", target = "orderId")
    FeedbackDTO toDto(Feedback feedback);

    @Override
    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "orderId", target = "order.id")
    Feedback toEntity(FeedbackDTO feedbackDTO);
}