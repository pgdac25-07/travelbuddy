package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Traveller;
import com.example.demo.entity.Users;
import com.example.demo.repository.TravellerRepository;
import com.example.demo.service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class AdminController {

    @Autowired
    private AdminService service;
    @Autowired
    private TravellerRepository travellerRepo;

    @PostMapping("/login")
    public Users login(@RequestParam String u, @RequestParam String p){
        return service.login(u,p);
    }

    @PostMapping("/create")
    public Users create(@RequestBody Users user){
        return service.createUser(user);
    }

    @PutMapping("/approve/{id}")
    public String approve(@PathVariable int id){
        service.approveCompany(id);
        return "Approved";
    }

    @PutMapping("/reject/{id}")
    public String reject(@PathVariable int id){
        service.rejectCompany(id);
        return "Rejected";
    }

    @GetMapping("/travellers")
    public List<Traveller> getAllTravellers() {
        return travellerRepo.findAll();
    }
    

   
}
