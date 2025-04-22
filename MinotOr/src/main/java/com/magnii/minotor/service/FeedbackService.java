package com.magnii.minotor.service;

import com.magnii.minotor.dto.FeedbackDTO;
import com.magnii.minotor.mapper.FeedbackMapper;
import com.magnii.minotor.model.Feedback;
import com.magnii.minotor.model.Order;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.FeedbackRepository;
import com.magnii.minotor.repository.OrderRepository;
import com.magnii.minotor.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackMapper feedbackMapper;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, FeedbackMapper feedbackMapper, OrderRepository orderRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.feedbackMapper = feedbackMapper;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public FeedbackDTO getFeedback(long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found"));
        return feedbackMapper.toDto(feedback);
    }

    public FeedbackDTO saveFeedback(FeedbackDTO feedbackDTO) {
        Feedback feedback = feedbackMapper.toEntity(feedbackDTO);

        Order order = orderRepository.findById(feedbackDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        User user = userRepository.findById(feedbackDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        feedback.setOrder(order);
        feedback.setUser(user);

        feedback = feedbackRepository.save(feedback);
        return feedbackMapper.toDto(feedback);
    }

    public FeedbackDTO updateFeedback(FeedbackDTO feedbackDTO) {
    if (feedbackDTO.getId() == null) {
        throw new IllegalArgumentException("Feedback ID must not be null for update.");
    }

    Feedback existingFeedback = feedbackRepository.findById(feedbackDTO.getId())
            .orElseThrow(() -> new RuntimeException("Feedback not found"));

        existingFeedback.setRating(feedbackDTO.getRating());
        existingFeedback.setComment(feedbackDTO.getComment());

        Order order = orderRepository.findById(feedbackDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        User user = userRepository.findById(feedbackDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingFeedback.setOrder(order);
        existingFeedback.setUser(user);

        return feedbackMapper.toDto(feedbackRepository.save(existingFeedback));
    }

    public void deleteFeedback(long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new RuntimeException("Feedback not found");
        }
        feedbackRepository.deleteById(id);
    }
}
