package com.magnii.minotor.service;

import com.magnii.minotor.dto.FeedbackDTO;
import com.magnii.minotor.mapper.FeedbackMapper;
import com.magnii.minotor.model.Feedback;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.FeedbackRepository;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.UserRepository;
import com.magnii.minotor.service.FeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class FeedbackServiceTest {

    @Mock private FeedbackRepository feedbackRepository;
    @Mock private FeedbackMapper feedbackMapper;
    @Mock private OrderRepository orderRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private FeedbackService feedbackService;

    private User user;
    private Order order;
    private Feedback entity;
    private FeedbackDTO dto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);

        order = new Order();
        order.setId(2L);

        entity = new Feedback();
        entity.setId(10L);
        entity.setUser(user);
        entity.setOrder(order);
        entity.setRating(5);
        entity.setComment("Great");

        dto = new FeedbackDTO();
        dto.setId(10L);
        dto.setUserId(1L);
        dto.setOrderId(2L);
        dto.setRating(5);
        dto.setComment("Great");
    }

    @Test
    void getFeedback_found_returnsDto() {
        when(feedbackRepository.findById(10L)).thenReturn(Optional.of(entity));
        when(feedbackMapper.toDto(entity)).thenReturn(dto);

        FeedbackDTO result = feedbackService.getFeedback(10L);

        assertThat(result.getId()).isEqualTo(10L);
        verify(feedbackRepository).findById(10L);
        verify(feedbackMapper).toDto(entity);
    }

    @Test
    void getFeedback_notFound_throws404Wrapped() {
        when(feedbackRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> feedbackService.getFeedback(999L));
    }

    @Test
    void saveFeedback_ok_mapsPersistsAndReturnsDto() {
        when(feedbackMapper.toEntity(dto)).thenReturn(entity);
        when(orderRepository.findById(2L)).thenReturn(Optional.of(order));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(feedbackRepository.save(entity)).thenReturn(entity);
        when(feedbackMapper.toDto(entity)).thenReturn(dto);

        FeedbackDTO saved = feedbackService.saveFeedback(dto);

        assertThat(saved.getComment()).isEqualTo("Great");
        verify(feedbackRepository).save(entity);
    }

    @Test
    void updateFeedback_missingId_throws() {
        FeedbackDTO bad = new FeedbackDTO();
        assertThrows(IllegalArgumentException.class, () -> feedbackService.updateFeedback(bad));
    }



    @Test
    void deleteFeedback_exists_deletes() {
        when(feedbackRepository.existsById(10L)).thenReturn(true);

        feedbackService.deleteFeedback(10L);

        verify(feedbackRepository).deleteById(10L);
    }

    @Test
    void deleteFeedback_missing_throws() {
        when(feedbackRepository.existsById(10L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> feedbackService.deleteFeedback(10L));
        verify(feedbackRepository, never()).deleteById(anyLong());
    }
}