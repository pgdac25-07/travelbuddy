package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "destination_id")
    private Integer destinationId;

    @Column(name = "dname")
    private String dname;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
