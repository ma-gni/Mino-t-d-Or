package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.CategoryDTO;
import com.magnii.minotor.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
class CategoryControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        categoryRepository.deleteAll();
    }

    private CategoryDTO makeDto(String name, String desc) {
        CategoryDTO dto = new CategoryDTO();
        dto.setName(name);
        dto.setDescription(desc);
        return dto;
    }

    @Nested
    @DisplayName("GET /api/categories")
    class GetAll {
        @Test @DisplayName("when none exist → empty list")
        void whenNone_thenEmpty() throws Exception {
            mockMvc.perform(get("/api/categories"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(0)));
        }

        @Test @DisplayName("when some exist → return them all")
        void whenSome_thenReturn() throws Exception {
            // seed two
            List<CategoryDTO> seeded = List.of(
                    makeDto("A", "a"),
                    makeDto("B", "b")
            );
            for (CategoryDTO c : seeded) {
                mockMvc.perform(post("/api/categories")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(c)))
                        .andExpect(status().isOk());
            }

            mockMvc.perform(get("/api/categories"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(2)))
                    .andExpect(jsonPath("$[*].name", containsInAnyOrder("A","B")));
        }
    }

    @Nested
    @DisplayName("GET /api/categories/{id}")
    class GetById {
        @Test @DisplayName("existing id → 200 + body")
        void existing() throws Exception {
            CategoryDTO dto = makeDto("X","x");
            String resp = mockMvc.perform(post("/api/categories")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andReturn().getResponse().getContentAsString();
            Long id = objectMapper.readValue(resp, CategoryDTO.class).getId();

            mockMvc.perform(get("/api/categories/{id}", id))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", is(id.intValue())))
                    .andExpect(jsonPath("$.name", is("X")));
        }

        @Test @DisplayName("nonexistent id → 404")
        void nonExisting() throws Exception {
            mockMvc.perform(get("/api/categories/{id}", 9999L))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("POST /api/categories")
    class Create {
        @Test @DisplayName("valid → 200 + created")
        void valid() throws Exception {
            CategoryDTO dto = makeDto("New","Desc");
            mockMvc.perform(post("/api/categories")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", notNullValue()))
                    .andExpect(jsonPath("$.name", is("New")))
                    .andExpect(jsonPath("$.description", is("Desc")));
        }

        @Test @DisplayName("missing name → 400")
        void missingName() throws Exception {
            CategoryDTO bad = new CategoryDTO();
            bad.setDescription("NoName");
            mockMvc.perform(post("/api/categories")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(bad)))
                    .andExpect(status().isBadRequest());
        }

        @Test @WithAnonymousUser @DisplayName("anonymous → 401")
        void anonymous() throws Exception {
            CategoryDTO dto = makeDto("Anon","x");
            mockMvc.perform(post("/api/categories")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("PUT /api/categories/{id}")
    class Update {
        @Test @DisplayName("existing + valid → 200 + updated")
        void existingValid() throws Exception {
            String resp = mockMvc.perform(post("/api/categories")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(makeDto("Old","o"))))
                    .andReturn().getResponse().getContentAsString();
            CategoryDTO created = objectMapper.readValue(resp, CategoryDTO.class);

            created.setName("Updated");
            created.setDescription("u");
            mockMvc.perform(put("/api/categories/{id}", created.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(created)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.name", is("Updated")));
        }

        @Test @DisplayName("nonexistent → 404")
        void nonExisting() throws Exception {
            CategoryDTO dto = makeDto("Doesnt","x");
            mockMvc.perform(put("/api/categories/{id}", 8888L)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isNotFound());
        }

        @Test @DisplayName("invalid body → 400")
        void invalidBody() throws Exception {
            String resp = mockMvc.perform(post("/api/categories")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(makeDto("Toy","t"))))
                    .andReturn().getResponse().getContentAsString();
            Long id = objectMapper.readValue(resp, CategoryDTO.class).getId();

            CategoryDTO bad = new CategoryDTO();
            bad.setDescription("no name");
            mockMvc.perform(put("/api/categories/{id}", id)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(bad)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("DELETE /api/categories/{id}")
    class Delete {
        @Test @DisplayName("existing → 204")
        void existing() throws Exception {
            String resp = mockMvc.perform(post("/api/categories")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(makeDto("Del","d"))))
                    .andReturn().getResponse().getContentAsString();
            Long id = objectMapper.readValue(resp, CategoryDTO.class).getId();

            mockMvc.perform(delete("/api/categories/{id}", id)
                            .with(csrf()))
                    .andExpect(status().isNoContent());

            // now gone
            mockMvc.perform(get("/api/categories/{id}", id))
                    .andExpect(status().isNotFound());
        }

        @Test @DisplayName("nonexistent → 404")
        void nonExisting() throws Exception {
            mockMvc.perform(delete("/api/categories/{id}", 7777L)
                            .with(csrf()))
                    .andExpect(status().isNotFound());
        }
    }
}