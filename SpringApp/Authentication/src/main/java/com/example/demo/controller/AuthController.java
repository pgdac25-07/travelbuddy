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
// @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository roleRepository;

    // 🔹 REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest req) {

        // Check if username already exists
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Create new user
        Users user = new Users();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword()); // plain text for now
        user.setRoleId(req.getRoleId());

        // Set user personal information if provided
        if (req.getFirstName() != null) {
            user.setFname(req.getFirstName());
        }
        if (req.getLastName() != null) {
            user.setLname(req.getLastName());
        }
        if (req.getPhone() != null && !req.getPhone().isEmpty()) {
            try {
                user.setPhoneno(Integer.parseInt(req.getPhone()));
            } catch (NumberFormatException e) {
                // Ignore if phone is not a valid number
            }
        }

        // For travel company registration (roleId = 2) keep the account in PENDING
        // state until it is approved by the admin module.
        // Admin (roleId = 3) and other roles are ACTIVE immediately.
        if (req.getRoleId() == 2) { // 2 = TRAVEL_COMPANY
            user.setStatus("PENDING");
        } else {
            // roleId = 3 => ADMIN, roleId = 1 => CUSTOMER, etc.
            user.setStatus("ACTIVE");
        }

        Users savedUser = userRepository.save(user);

        // If roleId = 1 (CUSTOMER/TRAVELLER), create customer entry
        if (req.getRoleId() == 1) {
            try {
                // Call Travel_Management service to create customer entry
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                String jsonBody = String.format("{\"userId\":%d,\"status\":\"1\"}", savedUser.getUserId());
                java.net.http.HttpRequest customerRequest = java.net.http.HttpRequest.newBuilder()
                        .uri(java.net.URI.create("http://localhost:8082/travelmgnt/customers/create"))
                        .header("Content-Type", "application/json")
                        .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonBody))
                        .build();

                java.net.http.HttpResponse<String> response = client.send(customerRequest,
                        java.net.http.HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() != 200) {
                    System.err.println("Failed to create customer entry: " + response.body());
                }
            } catch (Exception e) {
                System.err.println("Error creating customer entry: " + e.getMessage());
                // Don't fail registration if customer creation fails - log and continue
            }
        }

        return ResponseEntity.ok("Registration successful");
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
                    Map.of("message", "invalid login"));
        }

        // ❌ invalid password
        if (!user.getPassword().equals(req.getPassword())) {
            return ResponseEntity.ok(
                    Map.of("message", "invalid login"));
        }

        // ❌ travel company account not yet approved by admin
        // roleId = 2 => TRAVEL_COMPANY (see RegisterRequest comment)
        // Only allow login if status has been changed to APPROVED by the admin module.
        if (user.getRoleId() != null
                && user.getRoleId() == 2
                && (user.getStatus() == null
                        || !user.getStatus().equalsIgnoreCase("APPROVED"))) {
            return ResponseEntity.ok(
                    Map.of("message", "approval pending"));
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
