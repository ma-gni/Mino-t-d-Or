package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.UserDTO;
import com.magnii.minotor.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Optional;

@Mapper(componentModel = "spring", uses = {OrderMapper.class})
public interface UserMapper extends EntityMapper<UserDTO, User> {
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "password", ignore = true)
    UserDTO toDto(Optional<User> user);
}