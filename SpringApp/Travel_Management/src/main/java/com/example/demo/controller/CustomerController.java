package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepository;

import java.util.Map;

@RestController
@RequestMapping("/travelmgnt")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    // Create customer entry (called from Authentication service during registration)
    @PostMapping("/customers/create")
    public ResponseEntity<Map<String, String>> createCustomer(@RequestBody Map<String, Object> request) {
        try {
            Integer userId = Integer.parseInt(request.get("userId").toString());
            String status = request.get("status") != null ? request.get("status").toString() : "1";

            // Check if customer already exists for this user
            if (customerRepository.findByUserId(userId).isPresent()) {
                Map<String, String> response = Map.of("message", "Customer already exists for this user");
                return ResponseEntity.ok(response);
            }

            Customer customer = new Customer();
            customer.setUserId(userId);
            customer.setStatus(status);
            customerRepository.save(customer);

            Map<String, String> response = Map.of("message", "Customer created successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = Map.of("message", "Error creating customer: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
