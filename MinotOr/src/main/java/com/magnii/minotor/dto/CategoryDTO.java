package com.magnii.minotor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class CategoryDTO {
    private Long id;

    @NotBlank(message = "Name must not be blank")
    @Size(max = 100, message = "Name too long")
    private String name;

    @Size(max = 255)
    private String description;
}