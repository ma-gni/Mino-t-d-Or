package com.magnii.minotor.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "quotes")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime requestDate;

    /**
     * Legacy boolean; keep it for compatibility. We'll keep it in sync:
     * APPROVED => true, else false.
     */
    private boolean accepted;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuoteStatus status = QuoteStatus.PENDING;

    // Decision metadata (null while pending)
    private LocalDateTime decisionDate;

    @Column(precision = 5, scale = 2)
    private BigDecimal discountPercent;            // optional global discount, e.g. 10.00

    private String adminComment;                   // reason / note

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;                       // admin who decided

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "quote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuoteItem> items;
}