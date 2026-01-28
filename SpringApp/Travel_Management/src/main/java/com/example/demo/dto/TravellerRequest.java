package com.example.demo.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravellerRequest {
	private String fname;
    private String lname;
    private LocalDate bdate;
    private String gender;
}
