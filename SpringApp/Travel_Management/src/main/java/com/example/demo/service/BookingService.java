package com.example.demo.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.BookTripRequest;
import com.example.demo.dto.TravellerRequest;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Traveller;
import com.example.demo.entity.Users;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.TravellerRepository;
import com.example.demo.repository.UserRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private TravellerRepository travellerRepo;

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private CustomerRepository customerRepo;

    public String bookTrip(BookTripRequest req) {
        // Get customer_id from user_id (customerId in request is actually user_id)
        Customer customer = customerRepo.findByUserId(req.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found for user_id: " + req.getCustomerId()));

        // 1️⃣ Create booking
        Booking booking = new Booking();
        booking.setCustomerId(customer.getCustomerId()); // Use actual customer_id
        booking.setTripId(req.getTripId());
        booking.setBookingDate(LocalDate.now());
        // Use payment status from request, default to PENDING if not provided
        String paymentStatus = (req.getPaymentStatus() != null && !req.getPaymentStatus().isEmpty()) 
            ? req.getPaymentStatus() 
            : "PENDING";
        booking.setPaymentStatus(paymentStatus);

        int count = req.getTravellers() != null ? req.getTravellers().size() : 0;

        if (Boolean.TRUE.equals(req.getIncludeSelf())) {
            count += 1;
        }

        booking.setNoOfTravellers(count);

        Booking savedBooking = bookingRepo.save(booking);

        // 2️⃣ Add travellers from form
        if (req.getTravellers() != null) {
            for (TravellerRequest t : req.getTravellers()) {
                if (t.getFname() != null && !t.getFname().isEmpty()) {
                    Traveller tr = new Traveller();
                    tr.setFname(t.getFname());
                    tr.setLname(t.getLname());
                    tr.setBdate(t.getBdate());
                    tr.setGender(t.getGender());
                    tr.setBookingId(savedBooking.getBookingId());

                    travellerRepo.save(tr);
                }
            }
        }

        // 3️⃣ Include self as traveller (checkbox)
        if (Boolean.TRUE.equals(req.getIncludeSelf())) {
            Users user = userRepo.findById(req.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Traveller self = new Traveller();
            self.setFname(user.getFname() != null ? user.getFname() : "");
            self.setLname(user.getLname() != null ? user.getLname() : "");
            self.setBookingId(savedBooking.getBookingId());

            travellerRepo.save(self);
        }

        return "Trip booked successfully";
    }
}
