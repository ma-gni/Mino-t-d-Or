package com.magnii.minotor.repository;

import com.magnii.minotor.model.Quote;
import com.magnii.minotor.model.QuoteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findByUserIdOrderByRequestDateDesc(Long userId);
    List<Quote> findByStatusOrderByRequestDateDesc(QuoteStatus status);
    Optional<Quote> findByIdAndStatus(Long id, QuoteStatus status);
}