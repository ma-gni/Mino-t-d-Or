package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.SupplierDTO;
import com.magnii.minotor.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class SupplierControllerIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired SupplierRepository repo;
    @Autowired ObjectMapper json;

    @BeforeEach
    void cleanUp() {
        repo.deleteAll();
    }

    @Test
    void createAndRetrieveAndListAndDelete_andVerifyPersistence() throws Exception {
        // create
        SupplierDTO dto = new SupplierDTO();
        dto.setName("Acme");
        dto.setContactInfo("acme@example.com");

        String body = mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Acme"))
                .andExpect(jsonPath("$.contactInfo").value("acme@example.com"))
                .andReturn().getResponse().getContentAsString();

        SupplierDTO created = json.readValue(body, SupplierDTO.class);
        Long id = created.getId();

        // get by id
        mockMvc.perform(get("/api/suppliers/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value("Acme"));

        // get all
        mockMvc.perform(get("/api/suppliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(id))
                .andExpect(jsonPath("$[0].name").value("Acme"));

        // update
        created.setName("Acme Corp");
        created.setContactInfo("corp@acme.com");
        mockMvc.perform(put("/api/suppliers/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Acme Corp"))
                .andExpect(jsonPath("$.contactInfo").value("corp@acme.com"));

        // delete
        mockMvc.perform(delete("/api/suppliers/{id}", id))
                .andExpect(status().isNoContent());

        assertThat(repo.findById(id)).isEmpty();
    }

    //–– create validation errors ––//

    @Test
    void create_withBlankName_shouldReturn400() throws Exception {
        SupplierDTO bad = new SupplierDTO();
        bad.setName("");                 // blank
        bad.setContactInfo("foo@bar");

        mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_withNullContactInfo_shouldReturn400() throws Exception {
        SupplierDTO bad = new SupplierDTO();
        bad.setName("Foo");
        // contactInfo null

        mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(bad)))
                .andExpect(status().isBadRequest());
    }

    //–– non‐existent resources ––//

    @Test
    void get_nonExistentId_shouldReturn404() throws Exception {
        mockMvc.perform(get("/api/suppliers/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_nonExistentId_shouldReturn404() throws Exception {
        SupplierDTO dto = new SupplierDTO();
        dto.setName("X");
        dto.setContactInfo("x@x");
        mockMvc.perform(put("/api/suppliers/{id}", 999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_nonExistentId_shouldReturn404() throws Exception {
        mockMvc.perform(delete("/api/suppliers/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    //–– update validation error ––//

    @Test
    void update_withBlankName_shouldReturn400() throws Exception {
        // first create a valid
        SupplierDTO dto = new SupplierDTO();
        dto.setName("Valid");
        dto.setContactInfo("v@v");
        String resp = mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(dto)))
                .andReturn().getResponse().getContentAsString();

        SupplierDTO created = json.readValue(resp, SupplierDTO.class);

        // now send bad update
        created.setName("");
        mockMvc.perform(put("/api/suppliers/{id}", created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(created)))
                .andExpect(status().isBadRequest());
    }
}