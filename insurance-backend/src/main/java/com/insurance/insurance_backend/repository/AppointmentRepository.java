package com.insurance.insurance_backend.repository;

import com.insurance.insurance_backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // This 'extends JpaRepository' is what gives you the .save() method automatically
}