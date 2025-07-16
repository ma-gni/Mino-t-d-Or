package com.magnii.minotor.controller;

import com.magnii.minotor.dto.RoleAssignmentRequest;
import com.magnii.minotor.service.RoleService;
import com.magnii.minotor.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// In AuthController or create a new RoleController
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final UserService userService;
    private final RoleService roleService;

    public RoleController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignRoleToUser(@RequestBody RoleAssignmentRequest request) {
        userService.assignRole(request.getUsername(), request.getRoleName());
        return ResponseEntity.ok().build();
    }
}