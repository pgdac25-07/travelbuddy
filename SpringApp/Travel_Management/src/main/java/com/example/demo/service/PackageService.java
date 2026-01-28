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
        Optional<TravelPackage> optionalPkg = packageRepository.findById(id);
        if (optionalPkg.isPresent()) {
            TravelPackage existingPkg = optionalPkg.get();
            existingPkg.setPackageName(updatedPkg.getPackageName());
            existingPkg.setCompanyId(updatedPkg.getCompanyId());
            existingPkg.setCost(updatedPkg.getCost());
            existingPkg.setDuration(updatedPkg.getDuration());
            existingPkg.setDescription(updatedPkg.getDescription());
            existingPkg.setDestinationId(updatedPkg.getDestinationId());
            return packageRepository.save(existingPkg);
        }
        return null; // or throw custom exception
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

	
}
