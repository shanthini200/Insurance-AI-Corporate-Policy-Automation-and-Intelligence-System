package com.insurance.insurance_backend.controller;

import com.insurance.insurance_backend.entity.*;
import com.insurance.insurance_backend.repository.*;
import com.insurance.insurance_backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final UserRepository userRepository;
    private final AgentAvailabilityRepository availabilityRepository;
    private final PolicyRepository policyRepository;
    private final PolicyApplicationRepository applicationRepository;
    private final EmailService emailService; 

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // --- ✅ NEW: RESPOND TO RESCHEDULE ---
    @PutMapping("/respond-reschedule/{slotId}")
    public ResponseEntity<String> respondReschedule(@PathVariable Long slotId, @RequestParam String action) {
        AgentAvailability slot = availabilityRepository.findById(slotId).orElseThrow();
        User customer = getLoggedInUser();

        if (!slot.getBookedBy().getId().equals(customer.getId())) {
            return ResponseEntity.status(403).body("Not your booking");
        }

        if ("ACCEPT".equalsIgnoreCase(action)) {
            // Confirm the slot
            slot.setStatus("CONFIRMED");
            availabilityRepository.save(slot);

            try {
                emailService.sendEmail(slot.getAgent().getEmail(), "Reschedule Accepted ✅", 
                    "Customer " + customer.getName() + " accepted the new time: " + slot.getStartTime());
            } catch (Exception e) {}
            return ResponseEntity.ok("Reschedule Accepted!");

        } else {
            // Reject: Free the slot
            slot.setBooked(false);
            slot.setBookedBy(null);
            slot.setStatus("AVAILABLE");
            availabilityRepository.save(slot);
            return ResponseEntity.ok("Reschedule Rejected. Booking Cancelled.");
        }
    }

    // --- BOOKING REQUEST ---
    @PostMapping("/book/{slotId}")
    public ResponseEntity<String> bookSlot(@PathVariable Long slotId) {
        User customer = getLoggedInUser();
        AgentAvailability slot = availabilityRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.isBooked()) return ResponseEntity.badRequest().body("Slot already taken");

        slot.setBooked(true);
        slot.setBookedBy(customer);
        slot.setStatus("PENDING"); 
        availabilityRepository.save(slot);

        try {
            String agentEmail = slot.getAgent().getEmail();
            String subject = "New Booking Request 📅";
            String body = "Hello " + slot.getAgent().getName() + ",\n\n" +
                          "You have a new booking request from " + customer.getName() + ".\n" +
                          "Date: " + slot.getAvailableDate() + "\n" +
                          "Time: " + slot.getStartTime() + " - " + slot.getEndTime() + "\n\n" +
                          "Please login to your dashboard to Confirm or Reject this request.";
            
            emailService.sendEmail(agentEmail, subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }

        return ResponseEntity.ok("Booking Requested! Agent notified.");
    }

    // --- POLICY APPLICATION ---
    @PostMapping("/apply-policy/{policyId}")
    public ResponseEntity<String> applyPolicy(@PathVariable Long policyId) {
        User customer = getLoggedInUser();
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        PolicyApplication app = new PolicyApplication();
        app.setCustomer(customer);
        app.setPolicy(policy);
        app.setStatus("PENDING_AGENT");
        app.setApplicationDate(LocalDate.now());
        
        applicationRepository.save(app);

        try {
            String subject = "Policy Application Received 📄";
            String body = "Hello " + customer.getName() + ",\n\n" +
                          "We have received your application for: " + policy.getName() + ".\n" +
                          "Current Status: Pending Agent Review.";
            emailService.sendEmail(customer.getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send email");
        }

        return ResponseEntity.ok("Application submitted! Waiting for Agent approval.");
    }

    // --- GETTERS ---
    @GetMapping("/my-applications")
    public ResponseEntity<List<PolicyApplication>> getMyApplications() {
        return ResponseEntity.ok(applicationRepository.findByCustomer(getLoggedInUser()));
    }

    @GetMapping("/agents")
    public ResponseEntity<List<User>> getAllAgents() {
        return ResponseEntity.ok(userRepository.findByRole(Role.AGENT));
    }

    @GetMapping("/agent/{agentId}/slots")
    public ResponseEntity<List<AgentAvailability>> getAgentSlots(@PathVariable Long agentId) {
        List<AgentAvailability> allSlots = availabilityRepository.findByAgentIdOrderByAvailableDateAscStartTimeAsc(agentId);
        List<AgentAvailability> openSlots = allSlots.stream().filter(s -> !s.isBooked()).toList();
        return ResponseEntity.ok(openSlots);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<AgentAvailability>> getMyBookings() {
        return ResponseEntity.ok(availabilityRepository.findByBookedBy(getLoggedInUser()));
    }
}