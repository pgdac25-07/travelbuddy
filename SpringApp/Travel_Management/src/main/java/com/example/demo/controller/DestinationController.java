package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Destination;
import com.example.demo.service.DestinationService;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @GetMapping("/all")
    public List<Destination> getAllDestinations() {
        List<Destination> destinations = destinationService.getAllDestinations();
        System.out.println("Returning " + destinations.size() + " destinations");
        return destinations;
    }

    @GetMapping("/{id}")
    public Destination getDestinationById(@PathVariable Integer id) {
        return destinationService.getDestinationById(id);
    }
}
