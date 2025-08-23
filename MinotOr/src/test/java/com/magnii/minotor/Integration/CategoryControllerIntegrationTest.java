package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.config.FirebaseConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.token.TokenService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@AutoConfigureTestDatabase
@ActiveProfiles("test")
class CategoryControllerIntegrationTest {

    @MockitoBean private TokenService tokenService;     // disable security token work
    @MockitoBean private FirebaseConfig firebaseConfig; // prevent Firebase init

    @Autowired private MockMvc mvc;
    private final ObjectMapper om = new ObjectMapper();

    private static final String BASE = "/api/categories";

    static class CatPayload {
        public Long id;
        public String name;
        public String description;
        CatPayload() {}
        CatPayload(String name, String description) { this.name = name; this.description = description; }
    }

    private CatPayload newCat(String prefix) {
        String unique = prefix + "_" + UUID.randomUUID();
        return new CatPayload(unique, prefix + " description");
    }

    @Test
    @DisplayName("POST /api/categories -> 201 Created with Location header")
    void createCategory_Returns201() throws Exception {
        var payload = newCat("Books");

        var result = mvc.perform(post(BASE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                // ✅ Accept both absolute and relative URLs
                .andExpect(header().string("Location", matchesPattern(".*/api/categories/\\d+$")))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value(payload.name))
                .andReturn();

        var body = result.getResponse().getContentAsString();
        var created = om.readValue(body, CatPayload.class);
        assertThat(created.id).isNotNull();
    }

    @Test
    @DisplayName("CRUD flow: create -> get -> list -> update -> delete")
    void crudFlow_Works() throws Exception {
        // create
        var payload = newCat("Games");
        var createRes = mvc.perform(post(BASE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andReturn();

        var created = om.readValue(createRes.getResponse().getContentAsString(), CatPayload.class);
        Long id = created.id;

        // get by id
        mvc.perform(get(BASE + "/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value(payload.name));

        // list all
        mvc.perform(get(BASE))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[?(@.id==" + id + ")]").exists());

        // update
        var update = new CatPayload(payload.name + "_updated", "updated desc");
        mvc.perform(put(BASE + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value(update.name))
                .andExpect(jsonPath("$.description").value(update.description));

        // delete
        mvc.perform(delete(BASE + "/" + id))
                .andExpect(status().isNoContent());

        // then 404 on get
        mvc.perform(get(BASE + "/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/categories/{id} -> 404 when absent")
    void getById_NotFound_404() throws Exception {
        mvc.perform(get(BASE + "/999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/categories/{id} -> 404 when absent")
    void update_NotFound_404() throws Exception {
        var update = new CatPayload("Nope", "nope");
        mvc.perform(put(BASE + "/888888")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(update)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/categories/{id} -> 404 when absent")
    void delete_NotFound_404() throws Exception {
        mvc.perform(delete(BASE + "/777777"))
                .andExpect(status().isNotFound());
    }
}