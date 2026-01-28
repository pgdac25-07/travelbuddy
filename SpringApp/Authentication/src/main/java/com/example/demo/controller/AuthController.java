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
        user.setStatus("ACTIVE");

        userRepository.save(user);

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
