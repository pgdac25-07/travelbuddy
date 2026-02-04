package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Destination;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Integer> {
}
