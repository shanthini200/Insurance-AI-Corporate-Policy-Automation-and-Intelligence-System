package com.insurance.insurance_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    @OneToOne
    @JoinColumn(name = "availability_id", nullable = false)
    private AgentAvailability availability;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "issue_description")
    private String issueDescription;

    @Column(name = "status")
    private String status; // SCHEDULED, COMPLETED, CANCELLED

    // --- GETTERS AND SETTERS (The missing part causing your errors) ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public User getAgent() { return agent; }
    public void setAgent(User agent) { this.agent = agent; }

    public AgentAvailability getAvailability() { return availability; }
    public void setAvailability(AgentAvailability availability) { this.availability = availability; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}