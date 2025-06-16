# 🔐 Spring Security Implementation in the MinotOr Project

This document explains the security design of the `MinotOr` project based on your implementation.

---

## ✅ 1. Password Encryption

You used `BCryptPasswordEncoder` to ensure user passwords are securely hashed before being saved into the database.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

### ✅ Why it's important:
- Prevents storing plain-text passwords.
- Even if the DB is compromised, attackers can’t recover actual passwords.
- BCrypt adapts over time, making brute-force attacks harder.

---

## 🔐 2. JWT Authentication Flow

You implemented a token-based security system using **JWT** (JSON Web Tokens). This is a modern approach to securing REST APIs.

### 🔁 Flow:
1. A user logs in with a username and password.
2. If the credentials are valid, a **JWT token** is generated.
3. The token is returned to the client and stored (e.g., in localStorage).
4. On each future request, the client sends the token in the HTTP Header:
   ```
   Authorization: Bearer <token>
   ```
5. A security filter intercepts this request, extracts and validates the token.
6. If valid, the request proceeds to the secured endpoint.

---

## ⚙️ 3. SecurityConfig Overview

Your `SecurityConfig.java` file:
- Disables CSRF (because you use stateless JWT).
- Permits public endpoints like `/auth/**`.
- Requires authentication for other API routes.
- Uses a custom `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`.

```java
http.csrf().disable()
    .authorizeHttpRequests()
    .requestMatchers("/auth/**").permitAll()
    .anyRequest().authenticated()
    .and()
    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
```

---

## 🔑 4. JwtUtils.java

This class handles:
- Generating JWT tokens
- Extracting usernames and roles from tokens
- Validating tokens

You used:
- `io.jsonwebtoken.Jwts` to build and parse tokens
- Secret keys and expiration values from your config class

---

## ⚙️ 5. JwtConfig.java

Centralized your JWT configuration:
- Secret key
- Token expiration time

This is good practice for security and maintainability.

---

## 🌱 6. DataInitializer.java

You implemented a script that:
- Creates default users and admins
- Encodes their passwords
- Assigns them roles

This helps in bootstrapping the app and testing features.

---

## ✅ What You Did Right

- ✅ Passwords are encrypted securely
- ✅ Stateless authentication via JWT
- ✅ Role-based access control
- ✅ Token generation and validation are well structured
- ✅ Separation of config, utilities, and initialization logic

---

This setup demonstrates your **understanding of secure, scalable, and modern backend authentication** practices.

