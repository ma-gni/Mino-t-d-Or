package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.ProductDTO;
import com.magnii.minotor.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    public void setup() {
        productRepository.deleteAll();
    }

    @Test
    public void testCreateProduct() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("Test Product");
        dto.setDescription("This is a test product.");
        dto.setPrice(BigDecimal.valueOf(29.99));

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.description").value("This is a test product."))
                .andExpect(jsonPath("$.price").value(29.99));
    }

    @Test
    public void testGetProductById_NotFound() throws Exception {
        mockMvc.perform(get("/api/products/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetAllProducts() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("Sample");
        dto.setDescription("Sample description");
        dto.setPrice(BigDecimal.valueOf(15.0));

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].name", is("Sample")));
    }

    @Test
    public void testUpdateProduct() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("Old Name");
        dto.setDescription("Old desc");
        dto.setPrice(BigDecimal.valueOf(10));

        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andReturn().getResponse().getContentAsString();

        ProductDTO created = objectMapper.readValue(response, ProductDTO.class);
        created.setName("New Name");

        mockMvc.perform(put("/api/products/" + created.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("New Name")));
    }

    @Test
    public void testDeleteProduct() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("To Delete");
        dto.setDescription("Delete me");
        dto.setPrice(BigDecimal.valueOf(5));

        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andReturn().getResponse().getContentAsString();

        ProductDTO created = objectMapper.readValue(response, ProductDTO.class);

        mockMvc.perform(delete("/api/products/" + created.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/products/" + created.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreateProduct_InvalidData() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("");  // Invalid
        dto.setPrice(null);  // Invalid

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testUpdateProduct_NotFound() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("Ghost");
        dto.setDescription("Doesn't exist");
        dto.setPrice(BigDecimal.valueOf(100));

        mockMvc.perform(put("/api/products/99999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDeleteProduct_NotFound() throws Exception {
        mockMvc.perform(delete("/api/products/99999"))
                .andExpect(status().isNotFound());
    }
}
