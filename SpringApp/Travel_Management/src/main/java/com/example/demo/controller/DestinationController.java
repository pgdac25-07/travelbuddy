package com.example.demo.controller;

import com.example.demo.entity.Destination;
import com.example.demo.repository.DestinationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/travelmgnt")
public class DestinationController {

    @Autowired
    private DestinationRepository destinationRepository;

    // Get all destinations
    @GetMapping("/destinations/all")
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    // Get destination by ID
    @GetMapping("/destinations/{id}")
    public Destination getDestinationById(@PathVariable Integer id) {
        return destinationRepository.findById(id).orElse(null);
    }
}
