package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.TravelPackage;
import com.example.demo.repository.PackageRepository;

@Service
public class PackageService {

    private final PackageRepository packageRepository;

    // Constructor injection (better than @Autowired)
    public PackageService(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    // Add package
    public TravelPackage addPackage(TravelPackage pkg) {
        return packageRepository.save(pkg);
    }

    // Update package
    public TravelPackage updatePackage(Integer id, TravelPackage updatedPkg) {
        return packageRepository.findById(id)
                .map(existingPkg -> {
                    existingPkg.setPackageName(updatedPkg.getPackageName());
                    existingPkg.setCompanyId(updatedPkg.getCompanyId());
                    existingPkg.setCost(updatedPkg.getCost());
                    existingPkg.setDuration(updatedPkg.getDuration());
                    existingPkg.setDescription(updatedPkg.getDescription());
                    existingPkg.setDestinationId(updatedPkg.getDestinationId());
                    return packageRepository.save(existingPkg);
                })
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + id));
    }

    // Delete package
    public boolean deletePackage(Integer id) {
        if (packageRepository.existsById(id)) {
            packageRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get all packages
    public List<TravelPackage> findAllPackages() {
        return packageRepository.findAll();
    }
}
