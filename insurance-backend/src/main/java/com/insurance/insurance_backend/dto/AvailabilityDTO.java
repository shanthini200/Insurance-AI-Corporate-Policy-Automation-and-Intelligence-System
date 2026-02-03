package com.insurance.insurance_backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AvailabilityDTO {
    
    // ✅ FIX: Renamed from 'date' to 'availableDate' to match Frontend JSON
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate availableDate; 

    @JsonFormat(pattern = "HH:mm") 
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;
    
    private boolean isBooked;
}