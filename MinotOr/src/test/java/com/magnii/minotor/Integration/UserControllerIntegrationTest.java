package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;
    private String uniqueUsername;

    @BeforeEach
    public void setup() {
        uniqueUsername = "testuser_" + UUID.randomUUID();

        user = new User();
        user.setUsername(uniqueUsername);
        user.setPassword("password123");
        user.setEmail("test@example.com");
        user.setAddress("123 Main St");
    }

    @Test
    public void testCreateUser() throws Exception {
        mockMvc.perform(post("/api/users")
                        .with(httpBasic(uniqueUsername, "password123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());
    }

    @Test
    public void testGetUserByUsername() throws Exception {
        mockMvc.perform(post("/api/users")
                        .with(httpBasic(uniqueUsername, "password123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/users/" + uniqueUsername)
                        .with(httpBasic(uniqueUsername, "password123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(uniqueUsername))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    public void testGetAllUsers() throws Exception {
        mockMvc.perform(post("/api/users")
                        .with(httpBasic(uniqueUsername, "password123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/users")
                        .with(httpBasic(uniqueUsername, "password123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").exists());
    }

    @Test
    public void testDeleteUser() throws Exception {
        mockMvc.perform(post("/api/users")
                        .with(httpBasic(uniqueUsername, "password123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated());

        mockMvc.perform(delete("/api/users/" + uniqueUsername)
                        .with(httpBasic(uniqueUsername, "password123")))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/users/" + uniqueUsername)
                        .with(httpBasic(uniqueUsername, "password123")))
                .andExpect(status().isNotFound());
    }
}