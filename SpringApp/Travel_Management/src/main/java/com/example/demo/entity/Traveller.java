package com.example.demo.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "travellers")
public class Traveller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "traveller_id")
    private Integer travellerId;

    private String fname;
    private String lname;
    private LocalDate bdate;
    private String gender;

    // many travellers -> one booking
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id")
    @JsonIgnore
    private Booking booking;
}
