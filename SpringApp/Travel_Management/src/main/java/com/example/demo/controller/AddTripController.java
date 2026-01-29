package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.AddTrip;
import com.example.demo.service.AddTripService;

@RestController 
@RequestMapping("/addTrip")
@CrossOrigin
public class AddTripController {

	@Autowired
	private AddTripService addTripService;
	
	//API to add trip
	//@PostMapping("/add/{packageId}")
//	public AddTrip addTrip(@RequestBody AddTrip trip, @PathVariable int packageId) {
//		return addTripService.createTrip(trip,packageId);
//	}
	
	@PostMapping("/add")
	public AddTrip addTrip(@RequestBody AddTrip trip) {
	    return addTripService.createTrip(trip);
	}

	
}
