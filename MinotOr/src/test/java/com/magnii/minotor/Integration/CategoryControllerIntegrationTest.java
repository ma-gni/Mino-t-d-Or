package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.CategoryDTO;
import com.magnii.minotor.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser   // simulate an authenticated user
public class CategoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    public void setup() {
        categoryRepository.deleteAll();
    }

    @Test
    public void testCreateAndGetCategory() throws Exception {
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setName("Electronics");
        categoryDTO.setDescription("Electronic devices");
        String json = objectMapper.writeValueAsString(categoryDTO);

        // Create (POST)
        mockMvc.perform(post("/api/categories")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Electronics")));

        // Retrieve (GET all)
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(1)));
    }

    @Test
    public void testUpdateCategory() throws Exception {
        // Create a category and capture its generated ID.
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setName("Books");
        categoryDTO.setDescription("Reading materials");
        String json = objectMapper.writeValueAsString(categoryDTO);

        MvcResult postResult = mockMvc.perform(post("/api/categories")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        String postResponse = postResult.getResponse().getContentAsString();
        CategoryDTO createdCategory = objectMapper.readValue(postResponse, CategoryDTO.class);
        Long createdId = createdCategory.getId();

        // Update the category using the captured ID.
        categoryDTO.setName("Updated Books");
        categoryDTO.setDescription("Updated description");
        String updateJson = objectMapper.writeValueAsString(categoryDTO);

        mockMvc.perform(put("/api/categories/" + createdId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Books")));
    }

    @Test
    public void testDeleteCategory() throws Exception {
        // Create a category and capture its ID.
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setName("Clothes");
        categoryDTO.setDescription("Apparel");
        String json = objectMapper.writeValueAsString(categoryDTO);
        MvcResult postResult = mockMvc.perform(post("/api/categories")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        String postResponse = postResult.getResponse().getContentAsString();
        CategoryDTO createdCategory = objectMapper.readValue(postResponse, CategoryDTO.class);
        Long createdId = createdCategory.getId();

        // Delete the category with the captured ID.
        mockMvc.perform(delete("/api/categories/" + createdId)
                        .with(csrf()))
                .andExpect(status().isNoContent());

        // GET all should now return an empty list.
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(0)));
    }
}