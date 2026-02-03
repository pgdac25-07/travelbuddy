//package com.example.demo.controller;
//
//import java.time.LocalDate;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.example.demo.dto.BookTripRequest;
//import com.example.demo.entity.Booking;
//import com.example.demo.service.BookingService;
//
//@RestController
//@RequestMapping("/bookings")
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
//public class BookingController {
//	
//	@Autowired
//    private BookingService bookingService;
//	
//	@PostMapping("/book")
//	public ResponseEntity<?> bookTrip(@RequestBody BookTripRequest req) {
//	    try {
//	        System.out.println("Received booking request: " + req);
//	        System.out.println("Customer ID (user_id): " + req.getCustomerId());
//	        System.out.println("Trip ID: " + req.getTripId());
//	        System.out.println("Include Self: " + req.getIncludeSelf());
//	        System.out.println("Travellers: " + req.getTravellers());
//	        
//	        bookingService.bookTrip(req);
//	        
//	        return ResponseEntity.ok(java.util.Map.of(
//	            "success", true,
//	            "message", "Booking successful"
//	        ));
//	    } catch (Exception e) {
//	        System.err.println("Error booking trip: " + e.getMessage());
//	        e.printStackTrace();
//	        return ResponseEntity.status(500).body(java.util.Map.of(
//	            "success", false,
//	            "message", "Booking failed: " + e.getMessage()
//	        ));
//	    }
//	}
//	
//	@RequestMapping(value = "/book", method = RequestMethod.OPTIONS)
//	public ResponseEntity<?> handleOptions() {
//	    return ResponseEntity.ok()
//	            .header("Access-Control-Allow-Origin", "http://localhost:3000")
//	            .header("Access-Control-Allow-Methods", "POST, OPTIONS")
//	            .header("Access-Control-Allow-Headers", "Content-Type")
//	            .header("Access-Control-Allow-Credentials", "true")
//	            .header("Access-Control-Max-Age", "3600")
//	            .build();
//	}
//
//}


package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.BookTripRequest;
import com.example.demo.service.BookingService;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(
    origins = "http://localhost:3000",
    allowCredentials = "true",
    methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.OPTIONS},
    allowedHeaders = "*"
)
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/book")
    public ResponseEntity<?> bookTrip(@RequestBody BookTripRequest req) {
        try {
            System.out.println("Received booking request: " + req);

            bookingService.bookTrip(req);

            return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "Booking successful"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of(
                "success", false,
                "message", "Booking failed: " + e.getMessage()
            ));
        }
    }
}

