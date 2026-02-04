package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Trip;
import com.example.demo.service.TripService;

@RestController
@RequestMapping("/travelmgnt")
public class TripController {
	@Autowired
    private TripService tripService;

    @PostMapping("/trips/add")
    public Trip addTrip(@RequestBody Trip trip) {
        return tripService.addTrip(trip);
    }

    @GetMapping("/trips/all")
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }
    @GetMapping("/trips/by-package/{packageId}")
    public List<Trip> getTripsByPackage(@PathVariable Integer packageId) {
        return tripService.getTripsByPackage(packageId);
    }

}
