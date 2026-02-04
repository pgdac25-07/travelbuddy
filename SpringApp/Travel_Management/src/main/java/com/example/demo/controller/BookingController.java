package com.example.demo.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.BookTripRequest;
import com.example.demo.entity.Booking;
import com.example.demo.service.BookingService;

@RestController
@RequestMapping("/travelmgnt")
public class BookingController {
	
	@Autowired
    private BookingService bookingService;
	
	 @PostMapping("/bookings/book")
	    public String bookTrip(@RequestBody BookTripRequest req) {
	        bookingService.bookTrip(req);
	        return "Booking successful";
	    }
	    

}
