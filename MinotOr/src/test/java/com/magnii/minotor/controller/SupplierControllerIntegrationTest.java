package com.magnii.minotor.controller;

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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class SupplierControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        supplierRepository.deleteAll();
    }

    @Test
    void testCreateSupplier() throws Exception {
        SupplierDTO dto = new SupplierDTO();
        dto.setName("New Supplier");
        dto.setContactInfo("contact@example.com");

        mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("New Supplier"))
                .andExpect(jsonPath("$.contactInfo").value("contact@example.com"));

        assertThat(supplierRepository.findAll()).hasSize(1);
    }

    @Test
    void testGetSupplierById() throws Exception {
        SupplierDTO dto = new SupplierDTO();
        dto.setName("Test Supplier");
        dto.setContactInfo("test@example.com");

        String response = mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        SupplierDTO created = objectMapper.readValue(response, SupplierDTO.class);

        mockMvc.perform(get("/api/suppliers/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Supplier"))
                .andExpect(jsonPath("$.contactInfo").value("test@example.com"));
    }

    @Test
    void testUpdateSupplier() throws Exception {
        SupplierDTO dto = new SupplierDTO();
        dto.setName("Old Supplier");
        dto.setContactInfo("old@example.com");

        String response = mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        SupplierDTO created = objectMapper.readValue(response, SupplierDTO.class);
        created.setName("Updated Supplier");
        created.setContactInfo("updated@example.com");

        mockMvc.perform(put("/api/suppliers/" + created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Supplier"))
                .andExpect(jsonPath("$.contactInfo").value("updated@example.com"));
    }

    @Test
    void testDeleteSupplier() throws Exception {
        SupplierDTO dto = new SupplierDTO();
        dto.setName("To Be Deleted");
        dto.setContactInfo("delete@example.com");

        String response = mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        SupplierDTO created = objectMapper.readValue(response, SupplierDTO.class);

        mockMvc.perform(delete("/api/suppliers/" + created.getId()))
                .andExpect(status().isNoContent());

        assertThat(supplierRepository.findById(created.getId())).isEmpty();
    }
}