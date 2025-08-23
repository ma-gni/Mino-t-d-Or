package com.magnii.minotor.unit;

import com.magnii.minotor.dto.DeliveryDTO;
import com.magnii.minotor.mapper.DeliveryMapper;
import com.magnii.minotor.model.Delivery;
import com.magnii.minotor.model.DeliveryStatus;
import com.magnii.minotor.repository.DeliveryRepository;
import com.magnii.minotor.service.DeliveryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class DeliveryServiceTest {

    @Mock private DeliveryRepository repo;
    @Mock private DeliveryMapper mapper;

    @InjectMocks
    private DeliveryService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private Delivery entity(Long id) {
        return Delivery.builder()
                .id(id)
                .clientId(100L)
                .clientUsername("client")
                .address("123 Street")
                .scheduledDate(LocalDate.now().plusDays(2))
                .status(DeliveryStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private DeliveryDTO dto(Long id) {
        return DeliveryDTO.builder()
                .id(id)
                .clientId(100L)
                .clientUsername("client")
                .address("123 Street")
                .scheduledDate(LocalDate.now().plusDays(2))
                .status(DeliveryStatus.PENDING)
                .build();
    }

    @Test
    @DisplayName("create: saves mapped entity and returns mapped dto")
    void create_ok() {
        var inDto = dto(null);
        var entBefore = entity(null);
        var entAfter = entity(1L);
        var outDto = dto(1L);

        when(mapper.toEntity(inDto)).thenReturn(entBefore);
        when(repo.save(entBefore)).thenReturn(entAfter);
        when(mapper.toDto(entAfter)).thenReturn(outDto);

        var result = service.create(inDto);

        assertThat(result.getId()).isEqualTo(1L);
        verify(repo).save(entBefore);
        verify(mapper).toDto(entAfter);
    }

    @Test
    @DisplayName("createForPaidOrder: builds entity, saves, maps back")
    void createForPaidOrder_ok() {
        var built = entity(null);
        built.setClientId(200L);
        built.setClientUsername("bob");
        built.setAddress("A");
        built.setScheduledDate(LocalDate.of(2030,1,1));
        var saved = entity(5L);
        var outDto = dto(5L);

        // We don’t map from DTO here; service builds entity directly.
        when(repo.save(any(Delivery.class))).thenReturn(saved);
        when(mapper.toDto(saved)).thenReturn(outDto);

        var result = service.createForPaidOrder(
                999L, 200L, "bob", "A", LocalDate.of(2030,1,1));

        assertThat(result.getId()).isEqualTo(5L);
        verify(repo).save(any(Delivery.class));
        verify(mapper).toDto(saved);
    }

    @Test
    @DisplayName("get: returns mapped dto when found")
    void get_found() {
        var found = entity(10L);
        var outDto = dto(10L);
        when(repo.findById(10L)).thenReturn(Optional.of(found));
        when(mapper.toDto(found)).thenReturn(outDto);

        var result = service.get(10L);

        assertThat(result.getId()).isEqualTo(10L);
        verify(repo).findById(10L);
    }

    @Test
    @DisplayName("get: returns null when missing")
    void get_missing() {
        when(repo.findById(123L)).thenReturn(Optional.empty());

        var result = service.get(123L);

        assertThat(result).isNull();
        verify(repo).findById(123L);
    }

    @Test
    @DisplayName("listAll: maps all")
    void listAll_ok() {
        var e1 = entity(1L); var e2 = entity(2L);
        var d1 = dto(1L); var d2 = dto(2L);

        when(repo.findAll()).thenReturn(List.of(e1, e2));
        when(mapper.toDto(e1)).thenReturn(d1);
        when(mapper.toDto(e2)).thenReturn(d2);

        var result = service.listAll();

        assertThat(result).extracting(DeliveryDTO::getId).containsExactly(1L, 2L);
    }

    @Test
    @DisplayName("listByClient: maps all")
    void listByClient_ok() {
        var e1 = entity(3L); var e2 = entity(4L);
        var d1 = dto(3L); var d2 = dto(4L);

        when(repo.findByClientId(100L)).thenReturn(List.of(e1, e2));
        when(mapper.toDto(e1)).thenReturn(d1);
        when(mapper.toDto(e2)).thenReturn(d2);

        var result = service.listByClient(100L);

        assertThat(result).extracting(DeliveryDTO::getId).containsExactly(3L, 4L);
        verify(repo).findByClientId(100L);
    }

    @Test
    @DisplayName("listByStatus: maps all")
    void listByStatus_ok() {
        var e1 = entity(7L); var e2 = entity(8L);
        e1.setStatus(DeliveryStatus.IN_TRANSIT);
        e2.setStatus(DeliveryStatus.IN_TRANSIT);
        var d1 = dto(7L); var d2 = dto(8L);
        d1.setStatus(DeliveryStatus.IN_TRANSIT);
        d2.setStatus(DeliveryStatus.IN_TRANSIT);

        when(repo.findByStatus(DeliveryStatus.IN_TRANSIT)).thenReturn(List.of(e1, e2));
        when(mapper.toDto(e1)).thenReturn(d1);
        when(mapper.toDto(e2)).thenReturn(d2);

        var result = service.listByStatus(DeliveryStatus.IN_TRANSIT);

        assertThat(result).extracting(DeliveryDTO::getId).containsExactly(7L, 8L);
        verify(repo).findByStatus(DeliveryStatus.IN_TRANSIT);
    }

    @Test
    @DisplayName("updateStatus: sets status and deliveredDate when DELIVERED")
    void updateStatus_delivered_setsDate() {
        var e = entity(11L);
        when(repo.findById(11L)).thenReturn(Optional.of(e));
        when(mapper.toDto(e)).thenAnswer(inv -> {
            var d = dto(11L);
            d.setStatus(e.getStatus());
            d.setDeliveredDate(e.getDeliveredDate());
            return d;
        });

        var today = LocalDate.now();
        var result = service.updateStatus(11L, DeliveryStatus.DELIVERED, today);

        assertThat(result.getStatus()).isEqualTo(DeliveryStatus.DELIVERED);
        assertThat(result.getDeliveredDate()).isEqualTo(today);
        verify(repo).findById(11L);
    }

    @Test
    @DisplayName("updateStatus: throws when missing")
    void updateStatus_missing_throws() {
        when(repo.findById(999L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> service.updateStatus(999L, DeliveryStatus.CANCELED, null));
    }

    @Test
    @DisplayName("updateTracking: updates fields")
    void updateTracking_ok() {
        var e = entity(12L);
        when(repo.findById(12L)).thenReturn(Optional.of(e));
        when(mapper.toDto(e)).thenAnswer(inv -> {
            var d = dto(12L);
            d.setCarrierName(e.getCarrierName());
            d.setTrackingNumber(e.getTrackingNumber());
            return d;
        });

        var res = service.updateTracking(12L, "ACME", "TRK-1");
        assertThat(res.getCarrierName()).isEqualTo("ACME");
        assertThat(res.getTrackingNumber()).isEqualTo("TRK-1");
    }

    @Test
    @DisplayName("updateAddress: updates address")
    void updateAddress_ok() {
        var e = entity(13L);
        when(repo.findById(13L)).thenReturn(Optional.of(e));
        when(mapper.toDto(e)).thenAnswer(inv -> {
            var d = dto(13L);
            d.setAddress(e.getAddress());
            return d;
        });

        var res = service.updateAddress(13L, "456 Avenue");
        assertThat(res.getAddress()).isEqualTo("456 Avenue");
    }

    @Test
    @DisplayName("delete: delegates to repository")
    void delete_ok() {
        service.delete(77L);
        verify(repo).deleteById(77L);
    }
}