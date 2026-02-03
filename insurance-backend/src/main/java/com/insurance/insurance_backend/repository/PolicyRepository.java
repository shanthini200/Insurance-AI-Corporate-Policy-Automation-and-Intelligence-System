package com.insurance.insurance_backend.repository;

import com.insurance.insurance_backend.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
}