package com.example.demo.service;

import com.example.demo.entity.Booking;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Trip;
import com.example.demo.entity.Traveller;
import com.example.demo.entity.TravelPackage;
import com.example.demo.entity.Users;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.TravellerRepository;
import com.example.demo.repository.TripRepository;
import com.example.demo.repository.PackageRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminTravellerService {

    @Autowired
    private TravellerRepository travellerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all travellers with booking and trip details
    public List<Map<String, Object>> getAllTravellersWithDetails() {
        List<Traveller> travellers = travellerRepository.findAll();
        
        return travellers.stream().map(traveller -> {
            Map<String, Object> travellerDetails = new HashMap<>();
            travellerDetails.put("travellerId", traveller.getTravellerId());
            travellerDetails.put("fname", traveller.getFname());
            travellerDetails.put("lname", traveller.getLname());
            travellerDetails.put("bdate", traveller.getBdate());
            travellerDetails.put("gender", traveller.getGender());
            travellerDetails.put("bookingId", traveller.getBookingId());
            
            // Get booking details
            if (traveller.getBookingId() != null) {
                Booking booking = bookingRepository.findById(traveller.getBookingId()).orElse(null);
                if (booking != null) {
                    travellerDetails.put("bookingDate", booking.getBookingDate());
                    travellerDetails.put("paymentStatus", booking.getPaymentStatus());
                    travellerDetails.put("noOfTravellers", booking.getNoOfTravellers());
                    travellerDetails.put("tripId", booking.getTripId());
                    travellerDetails.put("customerId", booking.getCustomerId());
                    
                    // Get customer details
                    if (booking.getCustomerId() != null) {
                        Customer customer = customerRepository.findById(booking.getCustomerId()).orElse(null);
                        if (customer != null && customer.getUserId() != null) {
                            Users user = userRepository.findById(customer.getUserId()).orElse(null);
                            if (user != null) {
                                String customerName = ((user.getFname() != null ? user.getFname() : "") + " " + 
                                    (user.getLname() != null ? user.getLname() : "")).trim();
                                travellerDetails.put("customerName", customerName);
                                travellerDetails.put("customerEmail", user.getEmail());
                            }
                        }
                    }
                    
                    // Get trip details
                    if (booking.getTripId() != null) {
                        Trip trip = tripRepository.findById(booking.getTripId()).orElse(null);
                        if (trip != null) {
                            travellerDetails.put("tripStartDate", trip.getStartDate());
                            travellerDetails.put("tripEndDate", trip.getEndDate());
                            travellerDetails.put("packageId", trip.getPackageId());
                            
                            // Get package details
                            if (trip.getPackageId() != null) {
                                TravelPackage pkg = packageRepository.findById(trip.getPackageId()).orElse(null);
                                if (pkg != null) {
                                    travellerDetails.put("packageName", pkg.getPackageName());
                                    travellerDetails.put("packageCost", pkg.getCost());
                                    travellerDetails.put("packageDuration", pkg.getDuration());
                                }
                            }
                        }
                    }
                }
            }
            
            return travellerDetails;
        }).collect(Collectors.toList());
    }

    // Get trip details for a specific booking
    public Map<String, Object> getTravellerTripDetails(Integer bookingId) {
        Map<String, Object> tripDetails = new HashMap<>();
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        tripDetails.put("bookingId", booking.getBookingId());
        tripDetails.put("bookingDate", booking.getBookingDate());
        tripDetails.put("paymentStatus", booking.getPaymentStatus());
        tripDetails.put("noOfTravellers", booking.getNoOfTravellers());
        
        // Get customer details
        if (booking.getCustomerId() != null) {
            Customer customer = customerRepository.findById(booking.getCustomerId()).orElse(null);
            if (customer != null && customer.getUserId() != null) {
                Users user = userRepository.findById(customer.getUserId()).orElse(null);
                if (user != null) {
                    String customerName = ((user.getFname() != null ? user.getFname() : "") + " " + 
                        (user.getLname() != null ? user.getLname() : "")).trim();
                    tripDetails.put("customerName", customerName);
                    tripDetails.put("customerEmail", user.getEmail());
                }
            }
        }
        
        // Get trip details
        if (booking.getTripId() != null) {
            Trip trip = tripRepository.findById(booking.getTripId()).orElse(null);
            if (trip != null) {
                tripDetails.put("tripId", trip.getTripId());
                tripDetails.put("tripStartDate", trip.getStartDate());
                tripDetails.put("tripEndDate", trip.getEndDate());
                
                // Get package details
                if (trip.getPackageId() != null) {
                    TravelPackage pkg = packageRepository.findById(trip.getPackageId()).orElse(null);
                    if (pkg != null) {
                        tripDetails.put("packageId", pkg.getPackageId());
                        tripDetails.put("packageName", pkg.getPackageName());
                        tripDetails.put("packageCost", pkg.getCost());
                        tripDetails.put("packageDuration", pkg.getDuration());
                        tripDetails.put("packageDescription", pkg.getDescription());
                    }
                }
            }
        }
        
        // Get all travellers for this booking
        List<Traveller> travellers = travellerRepository.findAll().stream()
                .filter(t -> t.getBookingId() != null && t.getBookingId().equals(bookingId))
                .collect(Collectors.toList());
        
        List<Map<String, Object>> travellerList = travellers.stream().map(t -> {
            Map<String, Object> tMap = new HashMap<>();
            tMap.put("travellerId", t.getTravellerId());
            tMap.put("fname", t.getFname());
            tMap.put("lname", t.getLname());
            tMap.put("bdate", t.getBdate());
            tMap.put("gender", t.getGender());
            return tMap;
        }).collect(Collectors.toList());
        
        tripDetails.put("travellers", travellerList);
        
        return tripDetails;
    }
}
