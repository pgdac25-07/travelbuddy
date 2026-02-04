package com.example.demo.controller;

import com.example.demo.entity.Booking;
import com.example.demo.entity.Traveller;
import com.example.demo.entity.Users;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.TravellerRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TravellerRepository travellerRepository;

    // Get all pending companies (roleId = 2, status = PENDING)
    @GetMapping("/pending-companies")
    public List<Users> getPendingCompanies() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoleId() != null && user.getRoleId() == 2)
                .filter(user -> user.getStatus() == null || user.getStatus().equalsIgnoreCase("PENDING"))
                .collect(Collectors.toList());
    }

    // Get all companies (roleId = 2)
    @GetMapping("/all-companies")
    public List<Users> getAllCompanies() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoleId() != null && user.getRoleId() == 2)
                .collect(Collectors.toList());
    }

    // Get all customers (roleId = 1)
    @GetMapping("/all-customers")
    public List<Users> getAllCustomers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoleId() != null && user.getRoleId() == 1)
                .collect(Collectors.toList());
    }

    // Approve company - set status to APPROVED
    @PutMapping("/approve-company/{userId}")
    public ResponseEntity<Map<String, String>> approveCompany(@PathVariable Integer userId) {
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        user.setStatus("APPROVED");
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Company approved successfully");
        return ResponseEntity.ok(response);
    }

    // Reject company - set status to REJECTED
    @PutMapping("/reject-company/{userId}")
    public ResponseEntity<Map<String, String>> rejectCompany(@PathVariable Integer userId) {
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        user.setStatus("REJECTED");
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Company rejected successfully");
        return ResponseEntity.ok(response);
    }

    // Activate customer - set status to ACTIVE
    @PutMapping("/activate-customer/{userId}")
    public ResponseEntity<Map<String, String>> activateCustomer(@PathVariable Integer userId) {
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        user.setStatus("ACTIVE");
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Customer activated successfully");
        return ResponseEntity.ok(response);
    }

    // Deactivate customer - set status to INACTIVE
    @PutMapping("/deactivate-customer/{userId}")
    public ResponseEntity<Map<String, String>> deactivateCustomer(@PathVariable Integer userId) {
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        user.setStatus("INACTIVE");
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Customer deactivated successfully");
        return ResponseEntity.ok(response);
    }

    // Get all bookings with details
    @GetMapping("/bookings/all-with-details")
    public List<Booking> getAllBookingsWithDetails() {
        return bookingRepository.findAll();
    }

    // Get all travellers with details
    @GetMapping("/travellers/all-with-details")
    public List<Traveller> getAllTravellersWithDetails() {
        return travellerRepository.findAll();
    }

    // Update payment status for a booking
    @PutMapping("/bookings/update-payment-status/{bookingId}")
    public ResponseEntity<Map<String, Object>> updatePaymentStatus(
            @PathVariable Integer bookingId,
            @RequestBody Map<String, String> request) {
        
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Booking not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        String newStatus = request.get("paymentStatus");
        if (newStatus != null) {
            booking.setPaymentStatus(newStatus);
            bookingRepository.save(booking);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment status updated successfully");
            return ResponseEntity.ok(response);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Invalid payment status");
        return ResponseEntity.badRequest().body(response);
    }

    // Get trips for a specific booking
    @GetMapping("/travellers/booking/{bookingId}/trips")
    public List<Traveller> getTripsForBooking(@PathVariable Integer bookingId) {
        return travellerRepository.findAll().stream()
                .filter(traveller -> traveller.getBookingId() != null && traveller.getBookingId().equals(bookingId))
                .collect(Collectors.toList());
    }
}
