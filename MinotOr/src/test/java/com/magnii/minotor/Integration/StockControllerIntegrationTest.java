package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.dto.StockDTO;
import com.magnii.minotor.model.Product;
import com.magnii.minotor.model.Warehouse;
import com.magnii.minotor.repository.ProductRepository;
import com.magnii.minotor.repository.StockRepository;
import com.magnii.minotor.repository.WarehouseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser
class StockControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private StockRepository stockRepository;

    private Long productId;
    private Long warehouseId;

    @BeforeEach
    void setUp() {
        stockRepository.deleteAll();
        productRepository.deleteAll();
        warehouseRepository.deleteAll();

        // seed a product
        Product p = new Product();
        p.setName("Test Product");
        p.setDescription("desc");
        p.setPrice(BigDecimal.valueOf(12.34));
        productId = productRepository.save(p).getId();

        // seed a warehouse
        Warehouse w = new Warehouse();
        w.setName("Test WH");
        w.setLocation("Somewhere");
        warehouseId = warehouseRepository.save(w).getId();
    }

    //–– happy-path create + get
    @Test
    void createAndGetStock_success() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(100);

        MvcResult mvc = mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.quantity", is(100)))
                .andExpect(jsonPath("$.productId", is(productId.intValue())))
                .andExpect(jsonPath("$.warehouseId", is(warehouseId.intValue())))
                .andReturn();

        StockDTO created = objectMapper.readValue(mvc.getResponse().getContentAsString(), StockDTO.class);

        mockMvc.perform(get("/api/stocks/{id}", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(100)))
                .andExpect(jsonPath("$.productId", is(productId.intValue())))
                .andExpect(jsonPath("$.warehouseId", is(warehouseId.intValue())));
    }

    //–– update happy-path
    @Test
    void updateStock_success() throws Exception {
        // first create
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(5);

        MvcResult mvc = mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        StockDTO created = objectMapper.readValue(mvc.getResponse().getContentAsString(), StockDTO.class);

        // now update
        created.setQuantity(42);
        mockMvc.perform(put("/api/stocks/{id}", created.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(42)));
    }

    //–– delete happy-path
    @Test
    void deleteStock_success() throws Exception {
        // create
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(7);

        MvcResult mvc = mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        StockDTO created = objectMapper.readValue(mvc.getResponse().getContentAsString(), StockDTO.class);

        // delete
        mockMvc.perform(delete("/api/stocks/{id}", created.getId())
                        .with(csrf()))
                .andExpect(status().isNoContent());

        // subsequent GET => 404
        mockMvc.perform(get("/api/stocks/{id}", created.getId()))
                .andExpect(status().isNotFound());
    }

    //–– missing/invalid payloads
    @Test
    void createStock_missingProductId_badRequest() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(10);

        mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createStock_missingWarehouseId_badRequest() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setQuantity(10);

        mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createStock_missingQuantity_badRequest() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);

        mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createStock_negativeQuantity_badRequest() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(-5);

        mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    //–– references to non-existent FK
    @Test
    void createStock_nonExistentProduct_notFound() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(9999L);
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(1);

        mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void createStock_nonExistentWarehouse_notFound() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(9999L);
        dto.setQuantity(1);

        mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    //–– GET/PUT/DELETE non-existent stock
    @Test
    void getStock_nonExistent_notFound() throws Exception {
        mockMvc.perform(get("/api/stocks/{id}", 9999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateStock_nonExistent_notFound() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(5);

        mockMvc.perform(put("/api/stocks/{id}", 9999L)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteStock_nonExistent_notFound() throws Exception {
        mockMvc.perform(delete("/api/stocks/{id}", 9999L)
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }
}