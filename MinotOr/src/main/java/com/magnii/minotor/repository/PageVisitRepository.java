package com.magnii.minotor.repository;

import com.magnii.minotor.model.PageVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PageVisitRepository extends JpaRepository<PageVisit, Long> {
} 