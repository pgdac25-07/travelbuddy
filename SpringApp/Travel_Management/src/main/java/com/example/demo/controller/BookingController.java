package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.BookTripRequest;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Customer;
import com.example.demo.entity.TravelPackage;
import com.example.demo.entity.Trip;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.PackageRepository;
import com.example.demo.repository.TripRepository;
import com.example.demo.service.BookingService;

@RestController
@RequestMapping("/travelmgnt")
public class BookingController {
	
	@Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private PackageRepository packageRepository;
	
	@PostMapping("/bookings/book")
	public String bookTrip(@RequestBody BookTripRequest req) {
	    bookingService.bookTrip(req);
	    return "Booking successful";
	}

	// Get all bookings for a customer (by userId)
	@GetMapping("/bookings/customer/{userId}")
	public ResponseEntity<List<Map<String, Object>>> getCustomerBookings(@PathVariable Integer userId) {
	    try {
	        // 1. Find customer by userId
	        Customer customer = customerRepository.findByUserId(userId)
	                .orElse(null);
	        
	        if (customer == null) {
	            return ResponseEntity.ok(new ArrayList<>());
	        }

	        // 2. Get all bookings for this customer
	        List<Booking> bookings = bookingRepository.findAll().stream()
	                .filter(booking -> booking.getCustomerId() != null 
	                        && booking.getCustomerId().equals(customer.getCustomerId()))
	                .collect(Collectors.toList());

	        if (bookings.isEmpty()) {
	            return ResponseEntity.ok(new ArrayList<>());
	        }

	        // 3. Create response with package name and trip date
	        List<Map<String, Object>> result = new ArrayList<>();
	        
	        for (Booking booking : bookings) {
	            // Find the trip for this booking
	            Trip trip = tripRepository.findById(booking.getTripId()).orElse(null);
	            
	            if (trip == null) continue;

	            // Find the package for this trip
	            TravelPackage pkg = packageRepository.findById(trip.getPackageId()).orElse(null);
	            
	            String packageName = pkg != null && pkg.getPackageName() != null 
	                    ? pkg.getPackageName() : "Unknown Package";
	            
	            String tripDate = trip.getStartDate() != null 
	                    ? trip.getStartDate().toString() 
	                    : "N/A";

	            Map<String, Object> bookingInfo = Map.of(
	                "bookingId", booking.getBookingId(),
	                "packageName", packageName,
	                "tripDate", tripDate,
	                "paymentStatus", booking.getPaymentStatus() != null ? booking.getPaymentStatus() : "PENDING"
	            );

	            result.add(bookingInfo);
	        }

	        return ResponseEntity.ok(result);
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().build();
	    }
	}
}
