package com.example.demo.controller;

import com.example.demo.service.AdminTravellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/travellers")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminTravellerController {

    @Autowired
    private AdminTravellerService adminTravellerService;

    // Get all travellers with booking and trip details
    @GetMapping("/all-with-details")
    public ResponseEntity<List<Map<String, Object>>> getAllTravellersWithDetails() {
        List<Map<String, Object>> travellers = adminTravellerService.getAllTravellersWithDetails();
        return ResponseEntity.ok(travellers);
    }

    // Get bookings/trips for a specific traveller (by bookingId)
    @GetMapping("/booking/{bookingId}/trips")
    public ResponseEntity<Map<String, Object>> getTravellerTrips(@PathVariable Integer bookingId) {
        Map<String, Object> tripDetails = adminTravellerService.getTravellerTripDetails(bookingId);
        return ResponseEntity.ok(tripDetails);
    }
}
