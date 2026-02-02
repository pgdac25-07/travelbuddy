package com.example.demo.entity;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name = "no_of_travellers")
    private Integer noOfTravellers;

    @Column(name = "payment_status")
    private String paymentStatus;

    // many bookings -> one customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // trip_id exists but no Trip relation used
    @Column(name = "trip_id")
    private Integer tripId;

    // one booking -> many travellers
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Traveller> travellers;
}
