package com.magnii.minotor.mapper;

import com.magnii.minotor.dto.UserDTO;
import com.magnii.minotor.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {OrderMapper.class})
public interface UserMapper extends EntityMapper<UserDTO, User> {
}