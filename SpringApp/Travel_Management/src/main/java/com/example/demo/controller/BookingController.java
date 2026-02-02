package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.BookTripRequest;
import com.example.demo.entity.Booking;
import com.example.demo.service.BookingService;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;


    // ✅ CREATE BOOKING
    @PostMapping("/book")
    public Booking bookTrip(@RequestBody BookTripRequest req) {
        return bookingService.bookTrip(req);
    }


    // ✅ GET ALL BOOKINGS
    @GetMapping("/showall")
    public List<Booking> seeAllBookings() {
        return bookingService.findAll();
    }
}
