package com.magnii.minotor.model;

import com.magnii.minotor.model.Product;
import com.magnii.minotor.model.Quote;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "quote_items")
public class QuoteItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "quote_id")
    private Quote quote;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Constructors
    public QuoteItem() {}

    public QuoteItem(Long id, int quantity, Quote quote, Product product) {
        this.id = id;
        this.quantity = quantity;
        this.quote = quote;
        this.product = product;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public Quote getQuote() { return quote; }
    public void setQuote(Quote quote) { this.quote = quote; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}