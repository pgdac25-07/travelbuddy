package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Trip;
import com.example.demo.service.TripService;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/trips")
public class TripController {
	@Autowired
    private TripService tripService;

    @PostMapping("/add")
    public Trip addTrip(@RequestBody Trip trip) {
        System.out.println("Received trip: " + trip);
        return tripService.addTrip(trip);
    }

    @RequestMapping(value = "/add", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "http://localhost:3000")
                .header("Access-Control-Allow-Methods", "POST, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .header("Access-Control-Allow-Credentials", "true")
                .header("Access-Control-Max-Age", "3600")
                .build();
    }

    @GetMapping("/all")
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }
    @GetMapping("/by-package/{packageId}")
    public List<Trip> getTripsByPackage(@PathVariable Integer packageId) {
        return tripService.getTripsByPackage(packageId);
    }

}
