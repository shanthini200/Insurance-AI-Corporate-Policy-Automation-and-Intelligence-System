package com.insurance.insurance_backend.controller;

// 1. Imports for your own classes
import com.insurance.insurance_backend.dto.BookingRequest;
import com.insurance.insurance_backend.service.AppointmentService;

// 2. Imports for Spring Boot annotations
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody BookingRequest request, Authentication auth) {
        // We assume the user ID is the username/email from the token for now, 
        // or you need to extract the ID from the Authentication principal.
        // For simplicity, we are passing a dummy ID or you can parse 'auth.getName()'
        
        // TEMPORARY FIX: If you haven't implemented logic to get ID from 'auth',
        // we will assume the frontend sends the customerID in the request for now,
        // OR we just use a hardcoded ID to test.
        Long customerId = 1L; // Replace this with logic to get ID from 'auth' later.
        
        return ResponseEntity.ok(appointmentService.bookAppointment(customerId, request));
    }
}