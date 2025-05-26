// src/main/java/com/magnii/minotor/dto/SupplierDTO.java
package com.magnii.minotor.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupplierDTO {
    private Long id;

    @NotBlank(message = "Name must not be blank")
    private String name;

    @NotBlank(message = "ContactInfo must not be blank")
    private String contactInfo;
}