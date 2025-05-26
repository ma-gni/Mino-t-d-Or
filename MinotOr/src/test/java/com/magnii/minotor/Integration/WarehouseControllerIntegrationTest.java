package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.WarehouseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class WarehouseControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private WarehouseDTO warehouseDTO;

    @BeforeEach
    public void setup() {
        warehouseDTO = new WarehouseDTO();
        warehouseDTO.setName("Warehouse_" + UUID.randomUUID());
        warehouseDTO.setLocation("Paris");
    }

    @Test
    public void testCreateWarehouse() throws Exception {
        mockMvc.perform(post("/api/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(warehouseDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(warehouseDTO.getName()))
                .andExpect(jsonPath("$.location").value("Paris"));
    }

    @Test
    public void testGetWarehouseById() throws Exception {
        // First create one
        String response = mockMvc.perform(post("/api/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(warehouseDTO)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        WarehouseDTO created = objectMapper.readValue(response, WarehouseDTO.class);

        mockMvc.perform(get("/api/warehouses/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.getId()))
                .andExpect(jsonPath("$.name").value(created.getName()));
    }

    @Test
    public void testGetAllWarehouses() throws Exception {
        // Ensure at least one exists
        mockMvc.perform(post("/api/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(warehouseDTO)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/warehouses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").exists());
    }

    @Test
    public void testUpdateWarehouse() throws Exception {
        String response = mockMvc.perform(post("/api/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(warehouseDTO)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        WarehouseDTO created = objectMapper.readValue(response, WarehouseDTO.class);
        created.setLocation("Lyon");

        mockMvc.perform(put("/api/warehouses/" + created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.location").value("Lyon"));
    }

    @Test
    public void testDeleteWarehouse() throws Exception {
        String response = mockMvc.perform(post("/api/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(warehouseDTO)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        WarehouseDTO created = objectMapper.readValue(response, WarehouseDTO.class);

        mockMvc.perform(delete("/api/warehouses/" + created.getId()))
                .andExpect(status().isNoContent());

        // Now 404 when fetching deleted
        mockMvc.perform(get("/api/warehouses/" + created.getId()))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void whenInvalidPayload_thenBadRequest() throws Exception {
        // Missing name & location => @NotBlank kicks in
        WarehouseDTO invalid = new WarehouseDTO();
        mockMvc.perform(post("/api/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenNotFound_thenNotFoundOnGetPutDelete() throws Exception {
        long nonExistent = 9999L;

        mockMvc.perform(get("/api/warehouses/" + nonExistent))
                .andExpect(status().isNotFound());

        WarehouseDTO update = new WarehouseDTO();
        update.setName("Whatever");
        update.setLocation("Nowhere");
        mockMvc.perform(put("/api/warehouses/" + nonExistent)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/warehouses/" + nonExistent))
                .andExpect(status().isNotFound());
    }
}