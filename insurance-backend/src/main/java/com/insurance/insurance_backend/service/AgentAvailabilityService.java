package com.insurance.insurance_backend.service;

import com.insurance.insurance_backend.entity.AgentAvailability;
import com.insurance.insurance_backend.entity.User;
import com.insurance.insurance_backend.repository.AgentAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentAvailabilityService {

    private final AgentAvailabilityRepository availabilityRepository;

    public void createDefaultSlots(User agent) {
        List<AgentAvailability> slots = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // 1. Loop for the next 4 weeks (28 days)
        for (int i = 0; i < 28; i++) {
            LocalDate date = today.plusDays(i);

            // 2. Skip Weekends (Saturday & Sunday)
            if (date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY) {
                continue;
            }

            // 3. Define the Daily Schedule
            // Morning
            addSlot(slots, agent, date, "09:00", "09:45");
            // Break 15m
            addSlot(slots, agent, date, "10:00", "10:45");
            addSlot(slots, agent, date, "10:45", "11:30");
            addSlot(slots, agent, date, "11:30", "12:15");
            // Lunch 1hr (12:15 - 01:15)
            // Afternoon
            addSlot(slots, agent, date, "13:15", "14:00");
            addSlot(slots, agent, date, "14:00", "14:45");
            // Break 15m
            addSlot(slots, agent, date, "15:00", "15:45");
        }

        availabilityRepository.saveAll(slots);
    }

    private void addSlot(List<AgentAvailability> slots, User agent, LocalDate date, String start, String end) {
        AgentAvailability slot = new AgentAvailability();
        slot.setAgent(agent);
        slot.setAvailableDate(date);
        slot.setStartTime(LocalTime.parse(start));
        slot.setEndTime(LocalTime.parse(end));
        slot.setBooked(false);
        slot.setStatus("AVAILABLE"); // ✅ CRITICAL FIX: Set Status to AVAILABLE
        slots.add(slot);
    }
}