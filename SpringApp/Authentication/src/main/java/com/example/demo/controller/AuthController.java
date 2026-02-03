package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.Roles;
import com.example.demo.entity.Users;
import com.example.demo.repository.RolesRepository;
import com.example.demo.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository roleRepository;

    // 🔹 REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(req.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
            }

            // Check if email already exists
            if (userRepository.findByEmail(req.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
            }

            // Create new user
            Users user = new Users();
            user.setUsername(req.getUsername() != null ? req.getUsername() : req.getEmail());
            user.setFname(req.getFirstName());
            user.setLname(req.getLastName());
            user.setEmail(req.getEmail());
            user.setPassword(req.getPassword()); // plain text for now
            user.setRoleId(req.getRoleId());
            
            // Set status based on role
            if (req.getRoleId() == 2) { // TRAVEL_COMPANY
                user.setStatus("pending"); // Needs admin approval
            } else {
                user.setStatus("ACTIVE"); // CUSTOMER is active by default
            }
            
            // Set phone number if provided
            if (req.getPhone() != null && !req.getPhone().isEmpty()) {
                try {
                    user.setPhoneno(Integer.parseInt(req.getPhone()));
                } catch (NumberFormatException e) {
                    // If phone is not a valid integer, set to null
                    user.setPhoneno(null);
                }
            }
            
            user.setAccCreateDate(java.time.LocalDateTime.now());

            Users savedUser = userRepository.save(user);

            // If role is CUSTOMER (1), create customer record
            if (req.getRoleId() == 1) {
                // Note: You'll need to create CustomerService or handle this in Travel_Management module
                // For now, we'll just save the user
            }

            return ResponseEntity.ok(Map.of("message", "Registration successful", "userId", savedUser.getUserId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    // 🔹 LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest req,
            HttpServletRequest request) {

        Users user = userRepository.findByUsername(req.getUsername())
                .orElse(null);

        // ❌ invalid username
        if (user == null) {
            return ResponseEntity.ok(
                    Map.of("message", "invalid login")
            );
        }

        // ❌ invalid password
        if (!user.getPassword().equals(req.getPassword())) {
            return ResponseEntity.ok(
                    Map.of("message", "invalid login")
            );
        }

        // ✅ create session
        HttpSession session = request.getSession(true);
        session.setAttribute("USER_ID", user.getUserId());
        session.setAttribute("ROLE_ID", user.getRoleId());
        session.setAttribute("USERNAME", user.getUsername());
        
     // ✅ ROLE JOIN
        Roles role = roleRepository
                .findById(user.getRoleId())
                .orElse(null);

        String roleName = role != null ? role.getRname() : null;

        // ✅ RETURN USER + ROLE
        LoginResponse response = new LoginResponse(user, roleName);
        return ResponseEntity.ok(response);
    }



    // 🔹 LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok("Logout successful");
    }
}
