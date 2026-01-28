package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.TravelPackage;

@Repository
public interface PackageRepository extends JpaRepository<TravelPackage, Integer> {
}
