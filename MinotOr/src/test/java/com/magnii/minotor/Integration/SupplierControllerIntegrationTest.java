package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.config.FirebaseConfig;
import com.magnii.minotor.dto.SupplierDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@AutoConfigureTestDatabase
@ActiveProfiles("test")
class SupplierControllerIntegrationTest {

    @MockitoBean private TokenService tokenService;     // disable security token work
    @MockitoBean private FirebaseConfig firebaseConfig; // prevent Firebase init

    @Autowired private MockMvc mvc;
    private final ObjectMapper om = new ObjectMapper();

    private static final String BASE = "/api/suppliers";

    private SupplierDTO newSupplier() {
        SupplierDTO dto = new SupplierDTO();
        dto.setName("Supplier_" + UUID.randomUUID());
        dto.setContactInfo("contact@example.com");
        return dto;
    }

    @Test
    @DisplayName("POST /api/suppliers -> 200 OK with created supplier")
    void createSupplier_Returns200() throws Exception {
        var payload = newSupplier();

        var result = mvc.perform(post(BASE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value(payload.getName()))
                .andReturn();

        SupplierDTO created = om.readValue(result.getResponse().getContentAsString(), SupplierDTO.class);
        assertThat(created.getId()).isNotNull();
    }

    @Test
    @DisplayName("CRUD flow: create -> get -> list -> update -> delete")
    void crudFlow_Works() throws Exception {
        // create
        var payload = newSupplier();
        var createRes = mvc.perform(post(BASE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andReturn();
        SupplierDTO created = om.readValue(createRes.getResponse().getContentAsString(), SupplierDTO.class);
        Long id = created.getId();

        // get
        mvc.perform(get(BASE + "/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value(payload.getName()));

        // list
        mvc.perform(get(BASE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id==" + id + ")]").exists());

        // update
        created.setName("UpdatedName");
        mvc.perform(put(BASE + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("UpdatedName"));

        // delete
        mvc.perform(delete(BASE + "/" + id))
                .andExpect(status().isNoContent());

        // get after delete -> 404
        mvc.perform(get(BASE + "/" + id))
                .andExpect(status().isNotFound());
    }
}