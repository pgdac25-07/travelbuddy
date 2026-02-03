package com.example.demo.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bookings")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "trip_id")   // 👈 EXPLICITLY MAP
    private Integer tripId;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "no_of_travellers")
    private Integer noOfTravellers;

    @Column(name = "payment_status")
    private String paymentStatus;
}
