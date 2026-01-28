package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "packages")
public class TravelPackage {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer packageId;

    private Integer companyId;
    private String packageName;
    private Double cost;
    private String duration;
    private String description;
    private Integer destinationId;

    
}
