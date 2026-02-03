package com.insurance.insurance_backend.dto;

public class BookingRequest {
    private Long agentId;
    private Long availabilityId;
    private String issueDescription;

    // Getters and Setters
    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }
    
    public Long getAvailabilityId() { return availabilityId; }
    public void setAvailabilityId(Long availabilityId) { this.availabilityId = availabilityId; }
    
    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }
}