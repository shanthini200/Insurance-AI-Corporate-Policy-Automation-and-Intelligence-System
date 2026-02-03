package com.insurance.insurance_backend.repository;

import com.insurance.insurance_backend.entity.AgentAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AgentAvailabilityRepository extends JpaRepository<AgentAvailability, Long> {
    
    List<AgentAvailability> findByAgentIdOrderByAvailableDateAscStartTimeAsc(Long agentId);

    // ✅ NEW: Check for overlapping slots
    // Logic: (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
    @Query("SELECT a FROM AgentAvailability a WHERE a.agent.id = :agentId " +
           "AND a.availableDate = :date " +
           "AND a.startTime < :endTime AND a.endTime > :startTime")
    List<AgentAvailability> findOverlappingSlots(
        @Param("agentId") Long agentId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
    List<AgentAvailability> findByBookedBy(com.insurance.insurance_backend.entity.User user);
}