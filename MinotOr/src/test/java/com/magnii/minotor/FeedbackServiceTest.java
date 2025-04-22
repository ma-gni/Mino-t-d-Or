package com.magnii.minotor;

import com.magnii.minotor.dto.FeedbackDTO;
import com.magnii.minotor.mapper.FeedbackMapper;
import com.magnii.minotor.model.Feedback;
import com.magnii.minotor.repository.FeedbackRepository;
import com.magnii.minotor.service.FeedbackService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FeedbackServiceTest {

    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private FeedbackMapper feedbackMapper;

    @InjectMocks
    private FeedbackService feedbackService;

    @Test
    public void testGetFeedback_Success() {
        Long feedbackId = 1L;
        Feedback feedback = new Feedback();
        feedback.setId(feedbackId);
        // Set additional fields if needed (e.g., rating, comment)

        FeedbackDTO feedbackDTO = new FeedbackDTO();
        feedbackDTO.setId(feedbackId);
        // Set additional fields as needed

        when(feedbackRepository.findById(feedbackId)).thenReturn(Optional.of(feedback));
        when(feedbackMapper.toDto(feedback)).thenReturn(feedbackDTO);

        FeedbackDTO result = feedbackService.getFeedback(feedbackId);
        assertNotNull(result);
        assertEquals(feedbackId, result.getId());
        verify(feedbackRepository, times(1)).findById(feedbackId);
    }
}