package com.insurance.insurance_backend.repository;

import com.insurance.insurance_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import com.insurance.insurance_backend.entity.Role;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    // Add this inside the interface
    Optional<User> findByResetToken(String token);  
    List<User> findByRole(Role role);


}
