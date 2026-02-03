package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Destination;
import com.example.demo.repository.DestinationRepository;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public Destination getDestinationById(Integer id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
    }
}
