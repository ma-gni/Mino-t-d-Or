package com.magnii.minotor.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.magnii.minotor.config.FirebaseConfig;
import com.magnii.minotor.dto.StockDTO;
import com.magnii.minotor.model.Product;
import com.magnii.minotor.model.Warehouse;
import com.magnii.minotor.repository.ProductRepository;
import com.magnii.minotor.repository.WarehouseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.token.TokenService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@AutoConfigureTestDatabase
@ActiveProfiles("test")
class StockControllerIntegrationTest {

    @MockitoBean private TokenService tokenService;
    @MockitoBean private FirebaseConfig firebaseConfig;

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper om;
    @Autowired private ProductRepository productRepo;
    @Autowired private WarehouseRepository warehouseRepo;

    private Product product;
    private Warehouse warehouse;

    @BeforeEach
    void setup() {
        productRepo.deleteAll();
        warehouseRepo.deleteAll();

        product = new Product();
        product.setName("P1");
        product.setPrice(java.math.BigDecimal.valueOf(10));
        product.setStockQuantity(100);
        product = productRepo.save(product);

        warehouse = new Warehouse();
        warehouse.setName("W1");
        warehouse.setLocation("Loc");
        warehouse = warehouseRepo.save(warehouse);
    }

    @Test
    void createStock_ThenGetById() throws Exception {
        StockDTO dto = new StockDTO();
        dto.setProductId(product.getId());
        dto.setWarehouseId(warehouse.getId());
        dto.setQuantity(42);

        var createRes = mvc.perform(post("/api/stocks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.quantity").value(42))
                .andReturn();

        String json = createRes.getResponse().getContentAsString();
        StockDTO created = om.readValue(json, StockDTO.class);

        mvc.perform(get("/api/stocks/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.getId()))
                .andExpect(jsonPath("$.quantity").value(42));
    }
}