// src/main/java/com/magnii/minotor/dto/RoleAssignmentRequest.java
package com.magnii.minotor.dto;

import lombok.Data;

@Data
public class RoleAssignmentRequest {
    private String username;
    private String roleName; // e.g., ROLE_COMMERCIAL
}