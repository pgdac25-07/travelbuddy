//package com.example.demo.entity;
//
//
//import jakarta.persistence.*;
//import lombok.*;
//import java.util.List;
//
//@Entity
//@Table(name = "customers")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Customer {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int customer_id;
//
//    private int user_id;
//    
//    private String status;
//
//    // Optional reverse mapping
//    @OneToMany(mappedBy = "customer")
//    private List<Booking> bookings;
//}