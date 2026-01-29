package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.AddTrip;
import com.example.demo.entity.TravelPackage;
import com.example.demo.repository.AddTripRepository;
import com.example.demo.repository.PackageRepository;

@Service
public class AddTripService {

	@Autowired
	private AddTripRepository addTripRepository;
	
	@Autowired
	private PackageRepository packageRepository;
	
//	public AddTrip createTrip(AddTrip trip, int packageId) {
//		TravelPackage pkg= packageRepository.findById(packageId).orElseThrow(()-> new RuntimeException("Package not found with id:"+packageId));
//		
//		trip.setTravelPackage(pkg);
//		
//		return addTripRepository.save(trip);
//	}
	public AddTrip createTrip(AddTrip trip) {
	    return addTripRepository.save(trip);
	}

}
