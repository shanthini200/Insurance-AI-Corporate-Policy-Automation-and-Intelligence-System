package com.insurance.insurance_backend.controller;

import com.insurance.insurance_backend.dto.AvailabilityDTO;
import com.insurance.insurance_backend.entity.*;
import com.insurance.insurance_backend.repository.*;
import com.insurance.insurance_backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {

    private final AgentAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;
    private final PolicyApplicationRepository applicationRepository;
    private final EmailService emailService;

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    // --- BOOKING CONFIRMATION ---
    @PutMapping("/confirm-booking/{slotId}")
    public ResponseEntity<String> confirmBooking(@PathVariable Long slotId) {
        AgentAvailability slot = availabilityRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        
        slot.setStatus("CONFIRMED");
        availabilityRepository.save(slot);
        
        if(slot.getBookedBy() != null) {
            try {
                String customerEmail = slot.getBookedBy().getEmail();
                String subject = "Booking Confirmed! ✅";
                String body = "Hello " + slot.getBookedBy().getName() + ",\n\n" +
                              "Your appointment with Agent " + slot.getAgent().getName() + " has been CONFIRMED.\n" +
                              "Date: " + slot.getAvailableDate() + "\n" +
                              "Time: " + slot.getStartTime();
                
                emailService.sendEmail(customerEmail, subject, body);
            } catch (Exception e) {
                System.err.println("Failed to send email");
            }
        }

        return ResponseEntity.ok("Booking Confirmed and Email Sent");
    }

    // --- ✅ NEW: RESCHEDULE PROPOSAL ---
    @PostMapping("/reschedule-booking")
    public ResponseEntity<String> rescheduleBooking(@RequestBody Map<String, Long> payload) {
        Long oldSlotId = payload.get("oldSlotId");
        Long newSlotId = payload.get("newSlotId");

        AgentAvailability oldSlot = availabilityRepository.findById(oldSlotId).orElseThrow();
        AgentAvailability newSlot = availabilityRepository.findById(newSlotId).orElseThrow();
        User customer = oldSlot.getBookedBy();

        if (customer == null) return ResponseEntity.badRequest().body("Old slot has no customer");
        if (newSlot.isBooked()) return ResponseEntity.badRequest().body("New slot is already booked");

        // 1. Free up the Old Slot
        oldSlot.setBooked(false);
        oldSlot.setBookedBy(null);
        oldSlot.setStatus("AVAILABLE");
        availabilityRepository.save(oldSlot);

        // 2. Reserve New Slot as PROPOSED
        newSlot.setBooked(true);
        newSlot.setBookedBy(customer);
        newSlot.setStatus("PROPOSED");
        availabilityRepository.save(newSlot);

        // 3. Email Customer
        try {
            String link = "http://localhost:5173/dashboard"; 
            String body = "Hello " + customer.getName() + ",\n\n" +
                          "Agent " + oldSlot.getAgent().getName() + " requests to reschedule your appointment.\n" +
                          "Proposed New Time: \n" +
                          "📅 " + newSlot.getAvailableDate() + " at " + newSlot.getStartTime() + "\n\n" +
                          "Please login to Accept or Reject this change: " + link;
            
            emailService.sendEmail(customer.getEmail(), "Reschedule Proposed ⏳", body);
        } catch (Exception e) {}

        return ResponseEntity.ok("Reschedule proposed. Email sent to customer.");
    }

    // --- POLICY APPROVAL (Level 1) ---
    @PutMapping("/approve-policy/{appId}")
    public ResponseEntity<String> approvePolicy(@PathVariable Long appId) {
        PolicyApplication app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        app.setStatus("PENDING_ADMIN");
        applicationRepository.save(app);
        
        try {
            String subject = "Policy Update: Agent Approved";
            String body = "Hello " + app.getCustomer().getName() + ",\n\n" +
                          "Your application for " + app.getPolicy().getName() + " has been approved by the agent.\n" +
                          "It has now been forwarded to the Admin for Final Verification.";
            emailService.sendEmail(app.getCustomer().getEmail(), subject, body);
        } catch(Exception e) {
            System.err.println("Failed to send email");
        }

        return ResponseEntity.ok("Approved. Sent to Admin.");
    }

    // --- AVAILABILITY MANAGEMENT ---
    @GetMapping("/availability")
    public ResponseEntity<List<AgentAvailability>> getMyAvailability() {
        User agent = getLoggedInUser();
        List<AgentAvailability> slots = availabilityRepository.findByAgentIdOrderByAvailableDateAscStartTimeAsc(agent.getId());
        return ResponseEntity.ok(slots);
    }

    @PostMapping("/availability")
    public ResponseEntity<?> addAvailability(@RequestBody AvailabilityDTO request) {
        User agent = getLoggedInUser();

        if (request.getAvailableDate() == null || request.getStartTime() == null || request.getEndTime() == null) {
            return ResponseEntity.badRequest().body("Date and Time fields are required.");
        }

        LocalDateTime slotDateTime = LocalDateTime.of(request.getAvailableDate(), request.getStartTime());
        if (slotDateTime.isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Error: You cannot add a slot in the past.");
        }
        if (request.getEndTime().isBefore(request.getStartTime())) {
             return ResponseEntity.badRequest().body("Error: End time must be after Start time.");
        }

        List<AgentAvailability> overlaps = availabilityRepository.findOverlappingSlots(
            agent.getId(), request.getAvailableDate(), request.getStartTime(), request.getEndTime()
        );
        if (!overlaps.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: This slot overlaps with an existing one.");
        }

        AgentAvailability availability = new AgentAvailability();
        availability.setAgent(agent);
        availability.setAvailableDate(request.getAvailableDate());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setBooked(false);
        availability.setStatus("AVAILABLE");

        availabilityRepository.save(availability);
        return ResponseEntity.ok("Slot added successfully");
    }

    @DeleteMapping("/availability/{id}")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long id) {
        User agent = getLoggedInUser();
        AgentAvailability slot = availabilityRepository.findById(id).orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!slot.getAgent().getId().equals(agent.getId())) {
            return ResponseEntity.status(403).body("You cannot delete this slot");
        }
        availabilityRepository.delete(slot);
        return ResponseEntity.ok("Slot deleted successfully");
    }

    @GetMapping("/pending-policies")
    public ResponseEntity<List<PolicyApplication>> getPendingPolicies() {
        return ResponseEntity.ok(applicationRepository.findByStatus("PENDING_AGENT"));
    }
}