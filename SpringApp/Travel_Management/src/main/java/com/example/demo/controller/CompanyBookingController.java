package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Booking;
import com.example.demo.entity.Customer;
import com.example.demo.entity.TravelPackage;
import com.example.demo.entity.Trip;
import com.example.demo.entity.Users;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.PackageRepository;
import com.example.demo.repository.TripRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/travelmgnt")
public class CompanyBookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Get all bookings for a company (by companyId)
    @GetMapping("/company/{companyId}/bookings")
    public ResponseEntity<List<Map<String, Object>>> getCompanyBookings(@PathVariable Integer companyId) {
        try {
            // 1. Get all packages for this company
            List<TravelPackage> companyPackages = packageRepository.findAll().stream()
                    .filter(pkg -> pkg.getCompanyId() != null && pkg.getCompanyId().equals(companyId))
                    .collect(Collectors.toList());

            if (companyPackages.isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            // 2. Get all package IDs
            List<Integer> packageIds = companyPackages.stream()
                    .map(TravelPackage::getPackageId)
                    .collect(Collectors.toList());

            // 3. Get all trips for these packages
            List<Trip> trips = tripRepository.findAll().stream()
                    .filter(trip -> trip.getPackageId() != null && packageIds.contains(trip.getPackageId()))
                    .collect(Collectors.toList());

            if (trips.isEmpty()) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            // 4. Get all trip IDs
            List<Integer> tripIds = trips.stream()
                    .map(Trip::getTripId)
                    .collect(Collectors.toList());

            // 5. Get all bookings for these trips
            List<Booking> bookings = bookingRepository.findAll().stream()
                    .filter(booking -> booking.getTripId() != null && tripIds.contains(booking.getTripId()))
                    .collect(Collectors.toList());

            // 6. Create response with customer name, package name, date, and payment status
            List<Map<String, Object>> result = new ArrayList<>();
            
            for (Booking booking : bookings) {
                // Find the trip for this booking
                Trip trip = trips.stream()
                        .filter(t -> t.getTripId().equals(booking.getTripId()))
                        .findFirst()
                        .orElse(null);

                if (trip == null) continue;

                // Find the package for this trip
                TravelPackage pkg = companyPackages.stream()
                        .filter(p -> p.getPackageId().equals(trip.getPackageId()))
                        .findFirst()
                        .orElse(null);

                if (pkg == null) continue;

                // Get customer name via Customer -> Users relationship
                String customerName = "Customer " + booking.getCustomerId(); // Default
                try {
                    Customer customer = customerRepository.findById(booking.getCustomerId()).orElse(null);
                    if (customer != null) {
                        Users user = userRepository.findById(customer.getUserId()).orElse(null);
                        if (user != null) {
                            if (user.getFname() != null && user.getLname() != null) {
                                customerName = user.getFname() + " " + user.getLname();
                            } else if (user.getFname() != null) {
                                customerName = user.getFname();
                            } else if (user.getUsername() != null) {
                                customerName = user.getUsername();
                            }
                        }
                    }
                } catch (Exception e) {
                    // Keep default name if lookup fails
                }

                Map<String, Object> bookingInfo = Map.of(
                    "bookingId", booking.getBookingId(),
                    "customerName", customerName,
                    "packageName", pkg.getPackageName() != null ? pkg.getPackageName() : "N/A",
                    "tripDate", trip.getStartDate() != null ? trip.getStartDate().toString() : "N/A",
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
