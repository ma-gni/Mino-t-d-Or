package com.magnii.minotor.controller;

import com.magnii.minotor.model.Role;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.RoleRepository;
import com.magnii.minotor.repository.UserRepository;
import com.magnii.minotor.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setEmail(req.getEmail());
        user.setAddress(req.getAddress());
        user.setActivated(false);

        Optional<Role> bakerRole = roleRepository.findByName("ROLE_BOULANGER");
        if (bakerRole.isEmpty()) {
            return ResponseEntity.internalServerError().body("Default role not found");
        }
        user.setRoles(new HashSet<>(Set.of(bakerRole.get())));
        userRepository.save(user);

        return ResponseEntity.ok("User registered; awaiting activation");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtils.generateToken(userDetails);

        String rawRole = userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .findFirst()
                .orElse("ROLE_USER");

        String mappedRole = mapRoleToFrontend(rawRole);

        return ResponseEntity.ok(new JwtResponse(token, user.getId(), user.getUsername(), mappedRole));
    }

    private String mapRoleToFrontend(String backendRole) {
        return switch (backendRole) {
            case "ROLE_BOULANGER" -> "boulanger";
            case "ROLE_COMMERCIAL" -> "commercial";
            case "ROLE_APPROVISIONNEMENT" -> "approvisionneur";
            case "ROLE_PRÉPARATION" -> "preparateur";
            case "ROLE_LIVREUR" -> "livreur";
            case "ROLE_MAINTENANCE" -> "maintenance";
            case "ROLE_ANALYTICS" -> "admin";
            default -> "user";
        };
    }

    public static class RegisterRequest {
        private String username;
        private String password;
        private String email;
        private String address;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class JwtResponse {
        private String token;
        private Long id;
        private String username;
        private String role;

        public JwtResponse(String token, Long id, String username, String role) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.role = role;
        }
        public String getToken() { return token; }
        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getRole() { return role; }
    }
}