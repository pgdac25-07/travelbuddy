package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "packages")
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer packageId;      // maps to package_id

    private Integer companyId;      // maps to company_id

    private String packageName;     // maps to package_name

    private Double cost;            // maps to cost

    private String duration;        // maps to duration

    private String description;     // maps to description

    private Integer destinationId;  // maps to destination_id
}
