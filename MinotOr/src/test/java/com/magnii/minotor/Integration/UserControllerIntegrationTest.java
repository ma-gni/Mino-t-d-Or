package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import org.mockito.Answers;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.security.core.token.TokenService;

import com.magnii.minotor.dto.UserDTO;
import com.magnii.minotor.config.FirebaseConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.util.NestedServletException;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestDatabase
@ActiveProfiles("test")
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
class UserControllerIntegrationTest {

    @MockitoBean
    private org.springframework.security.core.token.TokenService tokenService;

    @org.mockito.Mock
    private FirebaseConfig firebaseConfig;

    @Autowired private MockMvc mvc;


    private final ObjectMapper om = new ObjectMapper();
    private static final String BASE = "/api/users";

    private UserDTO newUser(String username) {
        UserDTO dto = new UserDTO();
        dto.setUsername(username);
        dto.setEmail(username + "@test.dev");
        dto.setPassword("secret");
        dto.setAddress("42 Test Street");
        return dto;
    }

    @Test
    @DisplayName("POST /api/users -> 201 Created with Location header")
    void createUser_Returns201() throws Exception {
        String username = "alice_" + UUID.randomUUID();

        var dto = newUser(username);

        var result = mvc.perform(
                        post(BASE)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(om.writeValueAsString(dto))
                )
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/users/" + username))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn();

        var body = result.getResponse().getContentAsString();
        var created = om.readValue(body, UserDTO.class);
        assertThat(created.getUsername()).isEqualTo(username);
        assertThat(created.getEmail()).isEqualTo(username + "@test.dev");
        assertThat(created.getId()).isNotNull();
    }

    @Test
    @DisplayName("GET /api/users/{username} -> 200 OK when found")
    void getUserByUsername_Returns200() throws Exception {
        String username = "bob_" + UUID.randomUUID();
        mvc.perform(post(BASE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(newUser(username))))
                .andExpect(status().isCreated());

        mvc.perform(get(BASE + "/" + username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(username));
    }

    @Test
    @DisplayName("GET /api/users/{username} -> 404 Not Found when absent")
    void getUserByUsername_Returns404() throws Exception {
        mvc.perform(get(BASE + "/no_such_user_" + UUID.randomUUID()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/users/{username} -> 200 OK when deleted")
    void deleteUser_Returns200() throws Exception {
        String username = "charlie_" + UUID.randomUUID();
        mvc.perform(post(BASE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(newUser(username))))
                .andExpect(status().isCreated());

        mvc.perform(delete(BASE + "/" + username))
                .andExpect(status().isOk());

        mvc.perform(get(BASE + "/" + username))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/users/{username} -> 404 Not Found when user doesn't exist")
    void deleteUser_Returns404() throws Exception {
        mvc.perform(delete(BASE + "/ghost_" + UUID.randomUUID()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/users duplicate -> throws DataIntegrityViolationException")
    void createUser_Duplicate_Throws() throws Exception {
        String username = "dana_" + UUID.randomUUID();
        var payload = om.writeValueAsString(newUser(username));

        mvc.perform(post(BASE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated());

        assertThatThrownBy(() ->
                mvc.perform(post(BASE)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload))
                        .andReturn()
        )
                .isInstanceOf(ServletException.class)
                .hasCauseInstanceOf(DataIntegrityViolationException.class);
    }
}