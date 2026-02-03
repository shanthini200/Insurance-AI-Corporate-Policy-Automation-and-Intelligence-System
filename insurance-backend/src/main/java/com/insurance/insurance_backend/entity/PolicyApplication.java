package com.insurance.insurance_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class PolicyApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    // Status: "PENDING_AGENT", "PENDING_ADMIN", "APPROVED", "REJECTED"
    private String status;
    
    private LocalDate applicationDate;
}