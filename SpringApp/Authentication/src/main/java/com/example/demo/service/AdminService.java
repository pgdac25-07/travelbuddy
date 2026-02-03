package com.example.demo.service;

import com.example.demo.entity.Users;
import com.example.demo.entity.Admin;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.RolesRepository;
import com.example.demo.repository.AdminRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository roleRepository;
    
    @Autowired
    private AdminRepository adminRepository;

    // Get role ID for TRAVEL_COMPANY (assuming it's 2)
    private static final int TRAVEL_COMPANY_ROLE_ID = 2;
    
    // Get role ID for CUSTOMER (assuming it's 1)
    private static final int CUSTOMER_ROLE_ID = 1;
    
    // Get role ID for ADMIN (assuming it's 4)
    private static final int ADMIN_ROLE_ID = 4;

    // Get all pending travel companies
    public List<Users> getPendingCompanies() {
        List<Users> allUsers = userRepository.findAll();
        return allUsers.stream()
                .filter(user -> user.getRoleId() != null && 
                              user.getRoleId() == TRAVEL_COMPANY_ROLE_ID &&
                              (user.getStatus() == null || 
                               user.getStatus().equals("pending") || 
                               user.getStatus().equals("PENDING")))
                .collect(Collectors.toList());
    }

    // Get all travel companies
    public List<Users> getAllCompanies() {
        List<Users> allUsers = userRepository.findAll();
        System.out.println("Total users in database: " + allUsers.size());
        
        List<Users> companies = allUsers.stream()
                .filter(user -> {
                    boolean matches = user.getRoleId() != null && 
                                    user.getRoleId() == TRAVEL_COMPANY_ROLE_ID;
                    if (matches) {
                        System.out.println("Found company: " + user.getUsername() + " (role_id: " + user.getRoleId() + ")");
                    }
                    return matches;
                })
                .collect(Collectors.toList());
        
        System.out.println("Total companies found: " + companies.size());
        return companies;
    }

    // Get all customers
    public List<Users> getAllCustomers() {
        List<Users> allUsers = userRepository.findAll();
        System.out.println("Total users in database: " + allUsers.size());
        
        List<Users> customers = allUsers.stream()
                .filter(user -> {
                    boolean matches = user.getRoleId() != null && 
                                    user.getRoleId() == CUSTOMER_ROLE_ID;
                    if (matches) {
                        System.out.println("Found customer: " + user.getUsername() + " (role_id: " + user.getRoleId() + ")");
                    }
                    return matches;
                })
                .collect(Collectors.toList());
        
        System.out.println("Total customers found: " + customers.size());
        return customers;
    }

    // Update company status
    public void updateCompanyStatus(Integer userId, String status) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRoleId() != null && user.getRoleId() == TRAVEL_COMPANY_ROLE_ID) {
            user.setStatus(status);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User is not a travel company");
        }
    }

    // Update customer status
    public void updateCustomerStatus(Integer userId, String status) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRoleId() != null && user.getRoleId() == CUSTOMER_ROLE_ID) {
            user.setStatus(status);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User is not a customer");
        }
    }
}
