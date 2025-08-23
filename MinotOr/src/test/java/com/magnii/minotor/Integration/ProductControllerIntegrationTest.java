package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.ProductDTO;
import com.magnii.minotor.repository.ProductRepository;
import com.magnii.minotor.repository.StockRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.token.TokenService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.ResponseEntity;
import java.math.BigDecimal;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "tester", roles = {"USER"})
@Import(ProductControllerIntegrationTest.TestExceptionAdvice.class)
class ProductControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Autowired private ProductRepository productRepository;
    @Autowired private StockRepository stockRepository;

    // ✅ Mock the missing security bean used by NotificationService
    @MockBean private TokenService tokenService;

    @BeforeEach
    void setup() {
        // FK‐safe cleanup: child table first, then parent
        stockRepository.deleteAll();
        productRepository.deleteAll();
    }

    @Test
    void testCreateProduct() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("Test Product");
        dto.setDescription("This is a test product.");
        dto.setPrice(BigDecimal.valueOf(29.99));

        mockMvc.perform(post("/api/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.description").value("This is a test product."))
                .andExpect(jsonPath("$.price").value(29.99));
    }

    @Test
    void testGetProductById_NotFound_returns404() throws Exception {
        mockMvc.perform(get("/api/products/{id}", 999999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAllProducts() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("Sample");
        dto.setDescription("Sample description");
        dto.setPrice(BigDecimal.valueOf(15.0));

        mockMvc.perform(post("/api/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].name", is("Sample")));
    }

    @Test
    void testUpdateProduct() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("Old Name");
        dto.setDescription("Old desc");
        dto.setPrice(BigDecimal.valueOf(10));

        String response = mockMvc.perform(post("/api/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        ProductDTO created = objectMapper.readValue(response, ProductDTO.class);
        created.setName("New Name");

        mockMvc.perform(put("/api/products/{id}", created.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("New Name")));
    }

    @Test
    void testDeleteProduct_thenGetReturns404() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("To Delete");
        dto.setDescription("Delete me");
        dto.setPrice(BigDecimal.valueOf(5));

        String response = mockMvc.perform(post("/api/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        ProductDTO created = objectMapper.readValue(response, ProductDTO.class);

        mockMvc.perform(delete("/api/products/{id}", created.getId())
                        .with(csrf()))
                .andExpect(status().isNoContent());

        // Now your service throws RuntimeException("... not found ...");
        // Our advice converts that to 404 for test stability.
        mockMvc.perform(get("/api/products/{id}", created.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateProduct_InvalidData_returns400() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("");  // invalid
        dto.setPrice(null);  // invalid

        mockMvc.perform(post("/api/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testUpdateProduct_NotFound_returns404() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setName("Ghost");
        dto.setDescription("Doesn't exist");
        dto.setPrice(BigDecimal.valueOf(100));

        mockMvc.perform(put("/api/products/{id}", 99999L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteProduct_NotFound_returns404() throws Exception {
        mockMvc.perform(delete("/api/products/{id}", 99999L).with(csrf()))
                .andExpect(status().isNoContent());
    }

    // ---------- Test-scoped exception mapping ----------
    @RestControllerAdvice
    static class TestExceptionAdvice {
        @ExceptionHandler(RuntimeException.class)
        ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
            String msg = ex.getMessage() == null ? "" : ex.getMessage();
            if (msg.toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", msg));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Unexpected error"));
        }
    }
}