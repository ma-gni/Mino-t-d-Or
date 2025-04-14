package com.magnii.minotor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.ProductDTO;
import com.magnii.minotor.model.Category;
import com.magnii.minotor.repository.CategoryRepository;
import com.magnii.minotor.repository.OrderDetailRepository;
import com.magnii.minotor.repository.ProductRepository;
import com.magnii.minotor.repository.StockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "testuser", roles = {"USER"})
public class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private Long categoryId;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private StockRepository stockRepository;

    @BeforeEach
    void setUp() {
        orderDetailRepository.deleteAll(); // delete child entities first
        stockRepository.deleteAll();       // <- 💥 delete stocks before products
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        Category category = new Category();
        category.setName("Test Category");
        categoryId = categoryRepository.save(category).getId();
    }

    @Test
    void testCreateAndGetProduct() throws Exception {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName("Test Product");
        productDTO.setPrice(BigDecimal.valueOf(99.99));
        productDTO.setDescription("Test Description");
        productDTO.setStockQuantity(10);
        productDTO.setCategoryId(categoryId);

        String json = objectMapper.writeValueAsString(productDTO);

        String response = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProductDTO created = objectMapper.readValue(response, ProductDTO.class);

        mockMvc.perform(get("/api/products/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    void testUpdateProduct() throws Exception {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName("Old Product");
        productDTO.setPrice(BigDecimal.valueOf(50));
        productDTO.setDescription("Old Desc");
        productDTO.setStockQuantity(5);
        productDTO.setCategoryId(categoryId);

        ProductDTO saved = objectMapper.readValue(mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDTO)))
                .andReturn()
                .getResponse()
                .getContentAsString(), ProductDTO.class);

        saved.setName("Updated Product");
        saved.setPrice(BigDecimal.valueOf(150));

        mockMvc.perform(put("/api/products/" + saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saved)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Product"))
                .andExpect(jsonPath("$.price").value(150));
    }

    @Test
    void testDeleteProduct() throws Exception {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName("Product To Delete");
        productDTO.setPrice(BigDecimal.valueOf(25));
        productDTO.setDescription("To be deleted");
        productDTO.setStockQuantity(1);
        productDTO.setCategoryId(categoryId);

        ProductDTO saved = objectMapper.readValue(mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDTO)))
                .andReturn()
                .getResponse()
                .getContentAsString(), ProductDTO.class);

        mockMvc.perform(delete("/api/products/" + saved.getId()))
                .andExpect(status().isNoContent());

        assertThat(productRepository.findById(saved.getId())).isEmpty();
    }
}