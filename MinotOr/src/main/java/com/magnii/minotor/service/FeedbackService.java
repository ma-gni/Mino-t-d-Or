package com.magnii.minotor.service;

import com.magnii.minotor.dto.FeedbackDTO;
import com.magnii.minotor.mapper.FeedbackMapper;
import com.magnii.minotor.model.Feedback;
import com.magnii.minotor.repository.FeedbackRepository;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    public final FeedbackRepository feedbackRepository;
    public final FeedbackMapper feedbackMapper;


    public FeedbackService(FeedbackRepository feedbackRepository, FeedbackMapper feedbackMapper) {
        this.feedbackRepository = feedbackRepository;
        this.feedbackMapper = feedbackMapper;
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public FeedbackDTO getFeedback(long id) {
        Feedback feedback = feedbackRepository.findById(id).orElseThrow(() -> new RuntimeException("can't found id"));
        return feedbackMapper.toDto(feedback);
    }

    public FeedbackDTO saveFeedback(FeedbackDTO feedbackDTO) {
        Feedback feedback = feedbackMapper.toEntity(feedbackDTO);
        feedback = feedbackRepository.save(feedback);
        return feedbackMapper.toDto(feedback);
    }

    public FeedbackDTO updateFeedback(FeedbackDTO feedbackDTO) {
        Feedback updatedFeedback = feedbackMapper.toEntity(feedbackDTO);
        Feedback feedback = feedbackRepository.findById(updatedFeedback.getId()).orElseThrow(() -> new RuntimeException("can't found id"));
        feedback.setId(updatedFeedback.getId());
        feedback.setComment(updatedFeedback.getComment());
        feedback.setRating(updatedFeedback.getRating());
        return feedbackMapper.toDto(feedbackRepository.save(feedback));
    }

    public void deleteFeedback(long id) {
        feedbackRepository.deleteById(id);
    }


}