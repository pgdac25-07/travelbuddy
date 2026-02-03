package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.AddTrip;
import com.example.demo.service.AddTripService;

@RestController 
@RequestMapping("/addTrip")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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

	
}
