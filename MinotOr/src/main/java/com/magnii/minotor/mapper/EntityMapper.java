package com.magnii.minotor.mapper;

import java.util.List;

public interface EntityMapper <D, E>{
    E toEntity(D d);
    D toDto(E e);

    List<E> toEntity(List<D> dtoList);
    List<D> toDto(List<E> e);

}
