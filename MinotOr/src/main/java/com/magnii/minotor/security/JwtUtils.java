package com.magnii.minotor.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private final JwtEncoder jwtEncoder;
    private JwtDecoder jwtDecoder;

    public JwtUtils(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    @PostConstruct
    public void init() {
        SecretKey key = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        this.jwtDecoder = NimbusJwtDecoder.withSecretKey(key).build();
    }

    public String generateToken(UserDetails userDetails) {
        Instant now = Instant.now();

        String scope = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS))
                .subject(userDetails.getUsername())
                .claim("scope", scope)
                .build();

        // ✅ FIXED: Add header with kid matching JwtConfig
        JwsHeader header = JwsHeader.with(() -> "HS256")
                .keyId("minotor-key-id") // MUST match the one in JwtConfig
                .build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    public String getUsername(String token) {
        return jwtDecoder.decode(token).getSubject();
    }

    public List<String> getRoles(String token) {
        String scope = jwtDecoder.decode(token).getClaim("scope");
        return List.of(scope.split(" "));
    }

    public boolean validateToken(String token) {
        try {
            jwtDecoder.decode(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}