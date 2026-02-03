package com.insurance.insurance_backend.controller;

import com.insurance.insurance_backend.dto.RegisterRequest;
import com.insurance.insurance_backend.entity.*;
import com.insurance.insurance_backend.repository.*;
import com.insurance.insurance_backend.service.AgentAvailabilityService;
import com.insurance.insurance_backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AgentAvailabilityService availabilityService;
    private final PolicyApplicationRepository applicationRepository;
    private final AgentAvailabilityRepository availabilityRepository;
    private final EmailService emailService;

    // --- POLICY APPROVAL (Level 2: Final) ---
    @GetMapping("/pending-policies")
    public ResponseEntity<List<PolicyApplication>> getAdminPendingPolicies() {
        return ResponseEntity.ok(applicationRepository.findByStatus("PENDING_ADMIN"));
    }

    @PutMapping("/approve-policy-final/{appId}")
    public ResponseEntity<String> finalApprovePolicy(@PathVariable Long appId) {
        PolicyApplication app = applicationRepository.findById(appId).orElseThrow();
        app.setStatus("APPROVED"); // Final State
        applicationRepository.save(app);
        
        // SEND REAL EMAIL
        try {
            String subject = "Policy Approved! 🎉";
            String body = "Congratulations " + app.getCustomer().getName() + "!\n\n" +
                          "Your application for the policy '" + app.getPolicy().getName() + "' has been FULLY APPROVED.\n" +
                          "You are now covered.";
            emailService.sendEmail(app.getCustomer().getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send email");
        }
        
        return ResponseEntity.ok("Policy Application Finally Approved.");
    }

    // --- CONFIRM BOOKING (Admin Override) ---
    @PutMapping("/confirm-booking/{slotId}")
    public ResponseEntity<String> confirmBooking(@PathVariable Long slotId) {
        AgentAvailability slot = availabilityRepository.findById(slotId).orElseThrow();
        slot.setStatus("CONFIRMED");
        availabilityRepository.save(slot);
        
        if(slot.getBookedBy() != null) {
            try {
                String subject = "Booking Confirmed by Admin! ✅";
                String body = "Hello " + slot.getBookedBy().getName() + ",\n\n" +
                              "Your appointment with " + slot.getAgent().getName() + " is confirmed.\n" +
                              "Time: " + slot.getStartTime();
                emailService.sendEmail(slot.getBookedBy().getEmail(), subject, body);
            } catch (Exception e) {}
        }
        return ResponseEntity.ok("Booking Confirmed");
    }

    // --- STANDARD CRUD ---
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllCustomers() {
        return ResponseEntity.ok(userRepository.findByRole(Role.CUSTOMER));
    }

    @GetMapping("/agents")
    public ResponseEntity<List<User>> getAllAgents() {
        return ResponseEntity.ok(userRepository.findByRole(Role.AGENT));
    }

    @PostMapping("/add-agent")
    public ResponseEntity<String> addAgent(@RequestBody RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.AGENT)
                .verified(true)
                .build();
        User savedAgent = userRepository.save(user);
        availabilityService.createDefaultSlots(savedAgent);
        return ResponseEntity.ok("Agent added and schedule generated");
    }
    
    // ❌ REMOVED DUPLICATE METHOD: getAllPolicies()
    // It is now handled correctly in PolicyController.java
    
    @PutMapping("/update-user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> req) {
        User user = userRepository.findById(id).orElseThrow();
        if (req.containsKey("name")) user.setName(req.get("name"));
        if (req.containsKey("email")) user.setEmail(req.get("email"));
        if (req.containsKey("password") && !req.get("password").isEmpty()) user.setPassword(passwordEncoder.encode(req.get("password")));
        userRepository.save(user);
        return ResponseEntity.ok("User updated");
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}