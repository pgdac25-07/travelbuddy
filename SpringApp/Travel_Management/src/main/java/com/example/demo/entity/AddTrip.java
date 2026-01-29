package com.example.demo.entity;

import java.time.LocalDate;

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



@NoArgsConstructor      
@AllArgsConstructor  
@Entity
@Table(name="trips")
@Data
public class AddTrip {

	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)	
	private int trip_id;
	
	private LocalDate start_date;
	
	private LocalDate end_date;
	
	//Foreign Key Mapping: package_id is a foreign key and have many to one relation 
	//means many trips have one package 
	
	@ManyToOne
	@JoinColumn(name="package_id",nullable=false)
	private TravelPackage travelPackage;
}
