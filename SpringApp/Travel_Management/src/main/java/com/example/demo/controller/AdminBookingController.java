package com.example.demo.controller;

import com.example.demo.entity.Booking;
import com.example.demo.service.AdminBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/bookings")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminBookingController {

    @Autowired
    private AdminBookingService adminBookingService;

    // Get all bookings
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = adminBookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // Get bookings with customer and trip details (for display)
    @GetMapping("/all-with-details")
    public ResponseEntity<List<Map<String, Object>>> getAllBookingsWithDetails() {
        List<Map<String, Object>> bookings = adminBookingService.getAllBookingsWithDetails();
        return ResponseEntity.ok(bookings);
    }

    // Update payment status
    @PutMapping("/update-payment-status/{bookingId}")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Integer bookingId,
            @RequestBody Map<String, String> request) {
        try {
            String paymentStatus = request.get("paymentStatus");
            if (paymentStatus == null || (!paymentStatus.equals("PAID") && !paymentStatus.equals("PENDING"))) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid payment status. Must be 'PAID' or 'PENDING'"
                ));
            }
            
            adminBookingService.updatePaymentStatus(bookingId, paymentStatus);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment status updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Error: " + e.getMessage()
            ));
        }
    }
}
