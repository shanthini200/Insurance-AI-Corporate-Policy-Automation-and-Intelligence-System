package com.insurance.insurance_backend.service;

// 1. Imports for your DTOs and Entities
import com.insurance.insurance_backend.dto.BookingRequest;
import com.insurance.insurance_backend.entity.AgentAvailability;
import com.insurance.insurance_backend.entity.Appointment;
import com.insurance.insurance_backend.entity.User;

// 2. Imports for your Repositories
import com.insurance.insurance_backend.repository.AgentAvailabilityRepository;
import com.insurance.insurance_backend.repository.AppointmentRepository;
import com.insurance.insurance_backend.repository.UserRepository;

// 3. Imports for Spring Boot
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepo;

    @Autowired
    private AgentAvailabilityRepository availabilityRepo;

    @Autowired
    private UserRepository userRepo;

    @Transactional
    public Appointment bookAppointment(Long customerId, BookingRequest request) {
        
        // 1. Fetch the slot
        AgentAvailability slot = availabilityRepo.findById(request.getAvailabilityId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // 2. CHECK: Is it already booked?
        if (slot.isBooked()) {
            throw new RuntimeException("This slot is already booked!");
        }

        // 3. Mark slot as booked
        slot.setBooked(true);
        availabilityRepo.save(slot);

        // 4. Create Appointment
        Appointment appointment = new Appointment();
        
        User customer = userRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        User agent = userRepo.findById(request.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        appointment.setCustomer(customer);
        appointment.setAgent(agent);
        appointment.setAvailability(slot);
        appointment.setAppointmentDate(slot.getAvailableDate());
        appointment.setIssueDescription(request.getIssueDescription());
        appointment.setStatus("SCHEDULED");

        return appointmentRepo.save(appointment);
    }
}