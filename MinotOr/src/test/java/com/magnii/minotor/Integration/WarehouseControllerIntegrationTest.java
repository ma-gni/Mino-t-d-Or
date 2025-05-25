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

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
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

        mockMvc.perform(get("/api/warehouses/" + created.getId()))
                .andExpect(status().is4xxClientError());
    }
}