package com.magnii.minotor.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Size;

@Entity
public class Order {
    @Id
    @GeneratedValue
    private long id;
}
