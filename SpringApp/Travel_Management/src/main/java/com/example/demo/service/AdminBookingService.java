package com.example.demo.service;

import com.example.demo.entity.Booking;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Trip;
import com.example.demo.entity.Users;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.TripRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get all bookings with customer and trip details
    public List<Map<String, Object>> getAllBookingsWithDetails() {
        List<Booking> bookings = bookingRepository.findAll();
        
        return bookings.stream().map(booking -> {
            Map<String, Object> bookingDetails = new HashMap<>();
            bookingDetails.put("bookingId", booking.getBookingId());
            bookingDetails.put("bookingDate", booking.getBookingDate());
            bookingDetails.put("noOfTravellers", booking.getNoOfTravellers());
            bookingDetails.put("paymentStatus", booking.getPaymentStatus());
            bookingDetails.put("tripId", booking.getTripId());
            bookingDetails.put("customerId", booking.getCustomerId());
            
            // Get customer details
            if (booking.getCustomerId() != null) {
                Customer customer = customerRepository.findById(booking.getCustomerId()).orElse(null);
                if (customer != null && customer.getUserId() != null) {
                    Users user = userRepository.findById(customer.getUserId()).orElse(null);
                    if (user != null) {
                        String customerName = ((user.getFname() != null ? user.getFname() : "") + " " + 
                            (user.getLname() != null ? user.getLname() : "")).trim();
                        bookingDetails.put("customerName", customerName);
                        bookingDetails.put("customerEmail", user.getEmail());
                    }
                }
            }
            
            // Get trip details
            if (booking.getTripId() != null) {
                Trip trip = tripRepository.findById(booking.getTripId()).orElse(null);
                if (trip != null) {
                    bookingDetails.put("tripStartDate", trip.getStartDate());
                    bookingDetails.put("tripEndDate", trip.getEndDate());
                    bookingDetails.put("packageId", trip.getPackageId());
                }
            }
            
            return bookingDetails;
        }).collect(Collectors.toList());
    }

    // Update payment status
    public void updatePaymentStatus(Integer bookingId, String paymentStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
        
        booking.setPaymentStatus(paymentStatus);
        bookingRepository.save(booking);
    }
}
