package com.insurance.insurance_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., "Platinum Health Guard"
    
    private String type; // Life, Home, Vehicle, Health

    private Double premiumAmount; // Monthly cost
    
    private Double coverageAmount; // Payout amount

    @Column(length = 1000)
    private String description;
}