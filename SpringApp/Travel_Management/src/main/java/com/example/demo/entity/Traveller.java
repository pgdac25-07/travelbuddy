package com.example.demo.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "travellers")
public class Traveller {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer travellerId;

    private String fname;
    private String lname;
    private LocalDate bdate;
    private String gender;

    private Integer bookingId;

}
