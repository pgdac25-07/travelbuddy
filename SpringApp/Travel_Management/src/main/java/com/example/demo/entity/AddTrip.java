package com.example.demo.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="trips")
@Data
@NoArgsConstructor      
@AllArgsConstructor
public class AddTrip {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)	
	@Column(name = "trip_id")
	private int trip_id;
	
	@Column(name = "start_date")
	private LocalDate start_date;
	
	@Column(name = "end_date")
	private LocalDate end_date;

	@ManyToOne
	@JoinColumn(name="package_id", nullable=false)
	private TravelPackage travelPackage;
}
