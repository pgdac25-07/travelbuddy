package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Trip;

@Repository
public interface TripRepository extends JpaRepository<Trip, Integer> {
	List<Trip> findByPackageId(Integer packageId);
}
