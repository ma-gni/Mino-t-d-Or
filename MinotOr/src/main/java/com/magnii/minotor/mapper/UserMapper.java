package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.UserDTO;
import com.magnii.minotor.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderMapper.class})
public interface UserMapper extends EntityMapper<UserDTO, User> {
    @Override
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "password", ignore = true)
    UserDTO toDto(User user);
}