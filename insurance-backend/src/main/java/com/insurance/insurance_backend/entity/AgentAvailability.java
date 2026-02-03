package com.insurance.insurance_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
public class AgentAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    private LocalDate availableDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private boolean isBooked; // True if booked (even if pending)

    // ✅ NEW: Status of the booking
    private String status; // "AVAILABLE", "PENDING", "CONFIRMED"

    @ManyToOne
    @JoinColumn(name = "booked_by_customer_id")
    private User bookedBy;
}