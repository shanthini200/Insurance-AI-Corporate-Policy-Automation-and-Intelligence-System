package com.insurance.insurance_backend.repository;

import com.insurance.insurance_backend.entity.PolicyApplication;
import com.insurance.insurance_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PolicyApplicationRepository extends JpaRepository<PolicyApplication, Long> {
    List<PolicyApplication> findByCustomer(User customer);
    List<PolicyApplication> findByStatus(String status); // To find pending ones
}