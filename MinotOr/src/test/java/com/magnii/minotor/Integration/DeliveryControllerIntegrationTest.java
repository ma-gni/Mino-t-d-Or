package com.magnii.minotor.Integration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.magnii.minotor.config.FirebaseConfig;
import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.model.DeliveryStatus;
import org.junit.jupiter.api.DisplayName;
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

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests aligned with the current DeliveryController behavior:
 * - POST /api/deliveries returns 200 OK (not 201)
 * - DELETE /api/deliveries/{id} always returns 204 (even if the ID doesn't exist)
 * - GET /api/deliveries/{id} returns 404 when absent
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@AutoConfigureTestDatabase
@ActiveProfiles("test")
class DeliveryControllerIntegrationTest {

    @MockitoBean private TokenService tokenService;     // disable security token stuff
    @MockitoBean private FirebaseConfig firebaseConfig; // prevent Firebase init during tests

    @Autowired private MockMvc mvc;

    // ObjectMapper that supports Java Time
    private final ObjectMapper om = new ObjectMapper().registerModule(new JavaTimeModule());

    private static final String BASE = "/api/deliveries";

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class DeliveryPayload {
        public Long id;
        public Long orderId;
        public Long clientId;
        public String clientUsername;
        public String address;
        public String status;          // We read it as String in tests for simplicity
        public String carrierName;
        public String trackingNumber;
        public String notes;
        public LocalDate scheduledDate;
        public LocalDate deliveredDate;
    }

    private DeliveryDTO newDelivery() {
        String uname = "client_" + UUID.randomUUID().toString().substring(0, 8);
        return DeliveryDTO.builder()
                .clientId(100L)
                .clientUsername(uname)
                .address("123 Street")
                .scheduledDate(LocalDate.now().plusDays(1))
                .status(DeliveryStatus.PENDING)
                .build();
    }

    @Test
    @DisplayName("POST /api/deliveries -> 200 OK and returns created delivery")
    void createDelivery_Returns200() throws Exception {
        var dto = newDelivery();

        var result = mvc.perform(
                        post(BASE)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(om.writeValueAsString(dto))
                )
                .andExpect(status().isOk()) // controller currently returns 200 OK
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.clientId").value(dto.getClientId()))
                .andExpect(jsonPath("$.address").value(dto.getAddress()))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn();

        var body = result.getResponse().getContentAsString();
        var created = om.readValue(body, DeliveryPayload.class);
        assertThat(created.id).isNotNull();
    }

    @Test
    @DisplayName("CRUD: create -> get -> list -> update status/tracking/address -> delete")
    void crudFlow_Works() throws Exception {
        // create
        var dto = newDelivery();
        var createRes = mvc.perform(
                        post(BASE)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(om.writeValueAsString(dto))
                )
                .andExpect(status().isOk())
                .andReturn();

        var created = om.readValue(createRes.getResponse().getContentAsString(), DeliveryPayload.class);
        Long id = created.id;

        // get by id
        mvc.perform(get(BASE + "/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.clientId").value(dto.getClientId()));

        // list all (should contain our id)
        mvc.perform(get(BASE))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[?(@.id==" + id + ")]").exists());

        // update status -> DELIVERED (controller returns 200)
        var statusUpdateJson = """
                {"status":"DELIVERED","deliveredDate":"%s"}
                """.formatted(LocalDate.now().toString());
        mvc.perform(put(BASE + "/" + id + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(statusUpdateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.status").value("DELIVERED"));

        // update tracking
        var trackingUpdateJson = """
                {"carrierName":"ACME","trackingNumber":"TRK-%s"}
                """.formatted(UUID.randomUUID().toString().substring(0, 8));
        mvc.perform(put(BASE + "/" + id + "/tracking")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(trackingUpdateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.carrierName").value("ACME"));

        // update address
        var addressUpdateJson = """
                {"address":"456 Avenue"}
                """;
        mvc.perform(put(BASE + "/" + id + "/address")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(addressUpdateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.address").value("456 Avenue"));

        // delete (controller always returns 204)
        mvc.perform(delete(BASE + "/" + id))
                .andExpect(status().isNoContent());

        // then get -> 404 per controller code
        mvc.perform(get(BASE + "/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/deliveries/{id} -> 404 when absent")
    void getById_NotFound_404() throws Exception {
        mvc.perform(get(BASE + "/987654321"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/deliveries/{id} -> 204 even when absent (matches controller)")
    void delete_NonExisting_Returns204() throws Exception {
        mvc.perform(delete(BASE + "/12345678"))
                .andExpect(status().isNoContent());
    }
}