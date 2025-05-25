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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@WithMockUser
public class StockControllerIntegrationTest {

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
    public void setUp() {
        stockRepository.deleteAll();
        productRepository.deleteAll();
        warehouseRepository.deleteAll();

        Product product = new Product();
        product.setName("Test Product");
        product.setDescription("A product for testing");
        product.setPrice(BigDecimal.valueOf(10));
        productId = productRepository.save(product).getId();

        Warehouse warehouse = new Warehouse();
        warehouse.setName("Test Warehouse");
        warehouse.setLocation("Test City");
        warehouseId = warehouseRepository.save(warehouse).getId();
    }

    @Test
    public void testCreateAndGetStock() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(50);

        String json = objectMapper.writeValueAsString(dto);

        MvcResult result = mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(50)))
                .andReturn();

        StockDTO created = objectMapper.readValue(result.getResponse().getContentAsString(), StockDTO.class);

        mockMvc.perform(get("/api/stocks/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(50)))
                .andExpect(jsonPath("$.productId", is(productId.intValue())))
                .andExpect(jsonPath("$.warehouseId", is(warehouseId.intValue())));
    }

    @Test
    public void testUpdateStock() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(30);

        String json = objectMapper.writeValueAsString(dto);

        MvcResult result = mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        StockDTO created = objectMapper.readValue(result.getResponse().getContentAsString(), StockDTO.class);
        created.setQuantity(80);

        String updatedJson = objectMapper.writeValueAsString(created);

        mockMvc.perform(put("/api/stocks/" + created.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(80)));
    }

    @Test
    public void testDeleteStock() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);
        dto.setQuantity(20);

        String json = objectMapper.writeValueAsString(dto);

        MvcResult result = mockMvc.perform(post("/api/stocks")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        StockDTO created = objectMapper.readValue(result.getResponse().getContentAsString(), StockDTO.class);

        mockMvc.perform(delete("/api/stocks/" + created.getId()).with(csrf()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/stocks/" + created.getId()))
                .andExpect(status().isNotFound());
    }
}
