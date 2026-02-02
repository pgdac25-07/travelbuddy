package com.example.demo.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.BookTripRequest;
import com.example.demo.dto.TravellerRequest;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Traveller;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;

import jakarta.transaction.Transactional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Transactional
    public Booking bookTrip(BookTripRequest req) {

        Customer customer = customerRepo.findById(req.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Booking booking = new Booking();

        booking.setCustomer(customer);
        booking.setTripId(req.getTripId());
        booking.setBookingDate(LocalDate.now());
        booking.setPaymentStatus("PENDING");

        List<Traveller> travellers = new ArrayList<>();

        for (TravellerRequest t : req.getTravellers()) {
            Traveller tr = new Traveller();
            tr.setFname(t.getFname());
            tr.setLname(t.getLname());
            tr.setBdate(t.getBdate());
            tr.setGender(t.getGender());
            tr.setBooking(booking);

            travellers.add(tr);
        }

        booking.setTravellers(travellers);
        booking.setNoOfTravellers(travellers.size());

        return bookingRepo.save(booking); // ✅ return saved object
    }


    public List<Booking> findAll() {
        return bookingRepo.findAll();
    }
}
