package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Users;
import com.example.demo.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepo;

    // ================= LOGIN =================
    public Users login(String username, String password) {

        Users u = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!u.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return u;
    }


    // ================= CREATE ACCOUNT =================
    public Users createUser(Users user) {

        user.setStatus("ACTIVE");
        user.setAccCreateDate(LocalDateTime.now());

        return userRepo.save(user);
    }


    // ================= CHANGE PASSWORD =================
    public void changePassword(int id, String newPass) {

        Users u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        u.setPassword(newPass);

        userRepo.save(u);
    }


    // ================= APPROVE COMPANY =================
    public void approveCompany(int id) {

        Users u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        u.setStatus("ACTIVE");

        userRepo.save(u);
    }


    // ================= REJECT COMPANY =================
    public void rejectCompany(int id) {

        Users u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        u.setStatus("BLOCKED");

        userRepo.save(u);
    }


    // ================= VIEW TRAVELLERS =================
    public List<Users> getTravellers() {
        return userRepo.findByRole_Rname("TRAVELLER");
    }


    // ================= VIEW COMPANIES =================
    public List<Users> getCompanies() {
        return userRepo.findByRole_Rname("COMPANY");
    }
}
