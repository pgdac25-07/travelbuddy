package com.example.demo.controller;

import com.example.demo.entity.Users;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.RolesRepository;
import com.example.demo.service.AdminService;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository roleRepository;

    // Get all pending travel companies
    @GetMapping("/pending-companies")
    public ResponseEntity<List<Users>> getPendingCompanies() {
        List<Users> companies = adminService.getPendingCompanies();
        return ResponseEntity.ok(companies);
    }

    // Get all travel companies
    @GetMapping("/all-companies")
    public ResponseEntity<List<Users>> getAllCompanies() {
        List<Users> companies = adminService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    // Get all customers
    @GetMapping("/all-customers")
    public ResponseEntity<List<Users>> getAllCustomers() {
        List<Users> customers = adminService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // Approve/Activate travel company
    @PutMapping("/approve-company/{userId}")
    public ResponseEntity<String> approveCompany(@PathVariable Integer userId) {
        try {
            adminService.updateCompanyStatus(userId, "ACTIVE");
            return ResponseEntity.ok("Company approved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Reject/Deactivate travel company
    @PutMapping("/reject-company/{userId}")
    public ResponseEntity<String> rejectCompany(@PathVariable Integer userId) {
        try {
            adminService.updateCompanyStatus(userId, "REJECTED");
            return ResponseEntity.ok("Company rejected successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Activate customer account
    @PutMapping("/activate-customer/{userId}")
    public ResponseEntity<String> activateCustomer(@PathVariable Integer userId) {
        try {
            adminService.updateCustomerStatus(userId, "ACTIVE");
            return ResponseEntity.ok("Customer activated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Deactivate customer account
    @PutMapping("/deactivate-customer/{userId}")
    public ResponseEntity<String> deactivateCustomer(@PathVariable Integer userId) {
        try {
            adminService.updateCustomerStatus(userId, "INACTIVE");
            return ResponseEntity.ok("Customer deactivated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Get user by ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<Users> getUserById(@PathVariable Integer userId) {
        Users user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    // Debug endpoint - Get all users with their roles
    @GetMapping("/debug/all-users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersDebug() {
        List<Users> allUsers = userRepository.findAll();
        List<Map<String, Object>> usersWithRoles = allUsers.stream().map(user -> {
            Map<String, Object> userInfo = new java.util.HashMap<>();
            userInfo.put("userId", user.getUserId());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("roleId", user.getRoleId());
            userInfo.put("status", user.getStatus());
            return userInfo;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(usersWithRoles);
    }
}
