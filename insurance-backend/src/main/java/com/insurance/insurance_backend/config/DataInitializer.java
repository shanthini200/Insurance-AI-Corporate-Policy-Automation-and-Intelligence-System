package com.insurance.insurance_backend.config;

import com.insurance.insurance_backend.entity.Policy;
import com.insurance.insurance_backend.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final PolicyRepository policyRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only insert if the table is empty
        if (policyRepository.count() == 0) {
            
            Policy life = new Policy();
            life.setName("Lifetime Secure Plan");
            life.setType("Life");
            life.setPremiumAmount(150.00);
            life.setCoverageAmount(500000.00);
            life.setDescription("Full coverage for your family's future with term life benefits.");

            Policy health = new Policy();
            health.setName("Health Guard Plus");
            health.setType("Health");
            health.setPremiumAmount(80.00);
            health.setCoverageAmount(200000.00);
            health.setDescription("Comprehensive health insurance covering hospitalization and critical illness.");

            Policy vehicle = new Policy();
            vehicle.setName("Drive Safe Auto");
            vehicle.setType("Vehicle");
            vehicle.setPremiumAmount(50.00);
            vehicle.setCoverageAmount(30000.00);
            vehicle.setDescription("Complete protection for your car against accidents and theft.");

            Policy home = new Policy();
            home.setName("Sweet Home Shield");
            home.setType("Home");
            home.setPremiumAmount(120.00);
            home.setCoverageAmount(1000000.00);
            home.setDescription("Protect your home from fire, burglary, and natural disasters.");

            policyRepository.save(life);
            policyRepository.save(health);
            policyRepository.save(vehicle);
            policyRepository.save(home);

            System.out.println("✅ Default Policies Inserted into Database");
        }
    }
}