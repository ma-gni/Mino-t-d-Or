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

    @Value("${jwt.issuer:self}")
    private String issuer;

    private final JwtEncoder jwtEncoder;
    private JwtDecoder jwtDecoder;

    public JwtUtils(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    @PostConstruct
    public void init() {
        SecretKey key = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        this.jwtDecoder = NimbusJwtDecoder.withSecretKey(key).build();
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(userDetails, 1); // default: 1 hour
    }

    public String generateToken(UserDetails userDetails, int hours) {
        Instant now = Instant.now();
        String scope = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(now.plus(hours, ChronoUnit.HOURS))
                .subject(userDetails.getUsername())
                .claim("scope", scope)
                .build();

        JwsHeader header = JwsHeader.with(() -> "HS512")
                .keyId("minotor-key-id")
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
            Jwt decoded = jwtDecoder.decode(token);
            if (!issuer.equals(decoded.getIssuer().toString())) {
                throw new JwtException("Invalid token issuer");
            }
            return true;
        } catch (JwtException e) {
            System.err.println("❌ Invalid JWT: " + e.getMessage());
            return false;
        }
    }
}