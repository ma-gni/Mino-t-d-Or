package com.magnii.minotor.repository;


import com.magnii.minotor.model.QuoteItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuoteItemRepository extends JpaRepository<QuoteItem, Long> {
}