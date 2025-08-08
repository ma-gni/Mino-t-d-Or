package com.magnii.minotor.controller;

import com.magnii.minotor.model.PageVisit;
import com.magnii.minotor.repository.PageVisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PageVisitController {

    @Autowired
    private PageVisitRepository pageVisitRepository;

    @GetMapping("/page-visits")
    public ResponseEntity<List<PageVisit>> getPageVisits() {
        List<PageVisit> pageVisits = pageVisitRepository.findAll();
        return ResponseEntity.ok(pageVisits);
    }
} 