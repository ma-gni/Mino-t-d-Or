package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.config.FirebaseConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.mockito.Mock;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@AutoConfigureTestDatabase
@ActiveProfiles("test")
class WarehouseControllerIntegrationTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper om;

    @Mock private FirebaseConfig firebaseConfig; // keep Firebase quiet in tests

    private static final String BASE = "/api/warehouses";

    static class WarehousePayload {
        public Long id;
        public String name;
        public String location;
        WarehousePayload() {}
        WarehousePayload(String name, String location) {
            this.name = name; this.location = location;
        }
    }

    private static String uniq(String base) {
        return base + "_" + UUID.randomUUID().toString().substring(0,8);
    }

    @Test
    @DisplayName("POST /api/warehouses -> 200 OK and returns created")
    void create_Returns200() throws Exception {
        var payload = new WarehousePayload(uniq("Main"), "Paris");

        var res = mvc.perform(post(BASE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value(payload.name))
                .andExpect(jsonPath("$.location").value(payload.location))
                .andReturn();

        var created = om.readValue(res.getResponse().getContentAsString(), WarehousePayload.class);
        assertThat(created.id).isNotNull();
    }

    @Test
    @DisplayName("CRUD flow: create -> get -> list -> update -> delete -> 404 on get")
    void crudFlow_Works() throws Exception {
        // create
        var payload = new WarehousePayload(uniq("Depot"), "Lyon");
        var createRes = mvc.perform(post(BASE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andReturn();

        var created = om.readValue(createRes.getResponse().getContentAsString(), WarehousePayload.class);
        Long id = created.id;

        // get by id
        mvc.perform(get(BASE + "/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value(payload.name))
                .andExpect(jsonPath("$.location").value(payload.location));

        // list all
        mvc.perform(get(BASE))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[?(@.id==" + id + ")]").exists());

        // update
        var update = new WarehousePayload(payload.name + "_upd", "Marseille");
        mvc.perform(put(BASE + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value(update.name))
                .andExpect(jsonPath("$.location").value(update.location));

        // delete
        mvc.perform(delete(BASE + "/" + id))
                .andExpect(status().isNoContent());

        // then 404 on get
        mvc.perform(get(BASE + "/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/warehouses/{id} -> 404 when absent")
    void get_NotFound() throws Exception {
        mvc.perform(get(BASE + "/9999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/warehouses/{id} -> 404 when absent")
    void update_NotFound() throws Exception {
        var update = new WarehousePayload("Nope", "Nowhere");
        mvc.perform(put(BASE + "/888888")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(update)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/warehouses/{id} -> 404 when absent")
    void delete_NotFound() throws Exception {
        mvc.perform(delete(BASE + "/777777"))
                .andExpect(status().isNotFound());
    }
}