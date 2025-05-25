package com.magnii.minotor.config;

import com.magnii.minotor.model.Role;
import com.magnii.minotor.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // List of roles to seed at startup
    private static final List<String> ROLE_NAMES = Arrays.asList(
            "ROLE_BOULANGER",
            "ROLE_COMMERCIAL",
            "ROLE_APPROVISIONNEMENT",
            "ROLE_PRÉPARATION",
            "ROLE_LIVREUR",
            "ROLE_MAINTENANCE",
            "ROLE_ANALYTICS"
    );

    @PostConstruct
    public void seedRoles() {
        for (String roleName : ROLE_NAMES) {
            roleRepository.findByName(roleName)
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName(roleName);
                        return roleRepository.save(role);
                    });
        }
    }
}