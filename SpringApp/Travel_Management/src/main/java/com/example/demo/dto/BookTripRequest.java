package com.example.demo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookTripRequest {


    private Integer customerId;
    private Integer tripId;
    private Boolean includeSelf;
    private String paymentStatus; // "PAID" or "PENDING"

    private List<TravellerRequest> travellers;
}
