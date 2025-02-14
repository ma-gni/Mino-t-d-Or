package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.FeedbackDTO;
import com.magnii.minotor.model.Feedback;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class, OrderMapper.class})
public interface FeedbackMapper extends EntityMapper<FeedbackDTO, Feedback> {
}