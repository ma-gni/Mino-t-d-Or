package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.UserDTO;
import com.magnii.minotor.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Optional;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDto(User user);
    User toEntity(UserDTO dto);
}