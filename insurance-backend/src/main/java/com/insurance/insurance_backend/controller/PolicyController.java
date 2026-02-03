package com.insurance.insurance_backend.controller;

import com.insurance.insurance_backend.entity.Policy;
import com.insurance.insurance_backend.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyRepository policyRepository;

    // --- ADMIN ENDPOINTS ---
    @PostMapping("/api/admin/policies")
    public ResponseEntity<String> createPolicy(@RequestBody Policy policy) {
        policyRepository.save(policy);
        return ResponseEntity.ok("Policy created successfully");
    }

    @PutMapping("/api/admin/policies/{id}")
    public ResponseEntity<String> updatePolicy(@PathVariable Long id, @RequestBody Policy details) {
        Policy policy = policyRepository.findById(id).orElseThrow();
        policy.setName(details.getName());
        policy.setType(details.getType());
        policy.setPremiumAmount(details.getPremiumAmount());
        policy.setCoverageAmount(details.getCoverageAmount());
        policy.setDescription(details.getDescription());
        policyRepository.save(policy);
        return ResponseEntity.ok("Policy updated");
    }

    @DeleteMapping("/api/admin/policies/{id}")
    public ResponseEntity<String> deletePolicy(@PathVariable Long id) {
        policyRepository.deleteById(id);
        return ResponseEntity.ok("Policy deleted");
    }

    @GetMapping("/api/admin/policies")
    public ResponseEntity<List<Policy>> getAllPoliciesAdmin() {
        return ResponseEntity.ok(policyRepository.findAll());
    }

    // --- CUSTOMER ENDPOINTS (✅ This was likely missing!) ---
    @GetMapping("/api/customer/policies")
    public ResponseEntity<List<Policy>> getAllPoliciesCustomer() {
        return ResponseEntity.ok(policyRepository.findAll());
    }
}