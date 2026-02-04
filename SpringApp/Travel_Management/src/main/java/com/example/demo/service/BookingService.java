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

        // Convert user_id to customer_id
        // The req.getCustomerId() is actually user_id from the frontend
        Integer userId = req.getCustomerId();
        Customer customer = customerRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Customer record not found for user_id: " + userId
                        + ". Please ensure the user is registered as a customer."));

        Integer customerId = customer.getCustomerId();

        // 1️⃣ Create booking
        Booking booking = new Booking();
        booking.setCustomerId(customerId); // Use actual customer_id, not user_id
        booking.setTripId(req.getTripId());
        booking.setBookingDate(LocalDate.now());
        // Use paymentStatus from request, default to PENDING if not provided
        booking.setPaymentStatus(req.getPaymentStatus() != null ? req.getPaymentStatus() : "PENDING");

        int count = req.getTravellers().size();

        if (Boolean.TRUE.equals(req.getIncludeSelf())) {
            count += 1;
        }

        booking.setNoOfTravellers(count);

        Booking savedBooking = bookingRepo.save(booking);

        // 2️⃣ Add travellers from form
        for (TravellerRequest t : req.getTravellers()) {
            Traveller tr = new Traveller();
            tr.setFname(t.getFname());
            tr.setLname(t.getLname());
            tr.setBdate(t.getBdate());
            tr.setGender(t.getGender());
            tr.setBookingId(savedBooking.getBookingId());

            travellerRepo.save(tr);
        }

        // 3️⃣ Include self as traveller (checkbox)
        if (Boolean.TRUE.equals(req.getIncludeSelf())) {

            Users user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Traveller self = new Traveller();
            self.setFname(user.getFname());
            self.setLname(user.getLname());
            self.setBookingId(savedBooking.getBookingId());

            travellerRepo.save(self);
        }

        return "Trip booked successfully";
    }
}
