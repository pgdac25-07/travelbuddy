package com.example.demo.controller;

import com.example.demo.entity.TravelPackage;
import com.example.demo.service.PackageService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(
	    origins = "http://localhost:3000",
	    allowCredentials = "true"
	)

@RestController
@RequestMapping("/packages")
public class PackageController {

    @Autowired
    private PackageService packageService;

    // Add a new package
    @PostMapping("/add")
    public TravelPackage addPackage(@RequestBody TravelPackage pkg) {
        return packageService.addPackage(pkg);
    }
    
 // Update package
    @PutMapping("/update/{id}")
    public TravelPackage updatePackage(@PathVariable Integer id, @RequestBody TravelPackage pkg) {
        return packageService.updatePackage(id, pkg);
    }

    // Delete package
    @DeleteMapping("/delete/{id}")
    public String deletePackage(@PathVariable Integer id) {
        boolean deleted = packageService.deletePackage(id);
        return deleted ? "Package deleted successfully" : "Package not found";
    }

    // Optional: Get all packages
    @GetMapping("/all")
    public List<TravelPackage> getAllPackages() {
        return packageService.findAllPackages();
     }
    
    @GetMapping("/{id}")
    public TravelPackage getPackageById(@PathVariable Integer id) {
        return packageService.getPackageById(id);
    }

}

