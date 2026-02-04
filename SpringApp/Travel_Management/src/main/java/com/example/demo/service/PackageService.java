package com.example.demo.service;

import com.example.demo.entity.TravelPackage;
import com.example.demo.repository.PackageRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PackageService {

    @Autowired
    private PackageRepository packageRepository;

    // Add package
    public TravelPackage addPackage(TravelPackage pkg) {
        return packageRepository.save(pkg);
    }

    // Update package
    public TravelPackage updatePackage(Integer id, TravelPackage updatedPkg) {

        TravelPackage existing = packageRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        existing.setPackageName(updatedPkg.getPackageName());
        existing.setCost(updatedPkg.getCost());
        existing.setDuration(updatedPkg.getDuration());
        existing.setDescription(updatedPkg.getDescription());
        existing.setDestinationId(updatedPkg.getDestinationId());

        return packageRepository.save(existing);
    }

    // Delete package
    public boolean deletePackage(Integer id) {
        if (packageRepository.existsById(id)) {
            packageRepository.deleteById(id);
            return true;
        }
        return false;
    }

	public List<TravelPackage> findAllPackages() {
		// TODO Auto-generated method stub
		return packageRepository.findAll() ;
	}

	public TravelPackage getPackageById(Integer id) {
	    return packageRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Package not found"));
	}

	
}
