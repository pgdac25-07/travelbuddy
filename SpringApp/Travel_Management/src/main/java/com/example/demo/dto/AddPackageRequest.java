package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddPackageRequest {
	
	private String packageName;
    private Double cost;
    private String duration;
    private String description;
    private Integer destinationId;
}
