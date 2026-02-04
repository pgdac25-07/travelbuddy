package com.example.demo.controller;

import com.example.demo.entity.TravelPackage;
import com.example.demo.service.PackageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PackageControllerTest {

    @Mock
    private PackageService packageService;

    @InjectMocks
    private PackageController packageController;

    private TravelPackage testPackage;

    @BeforeEach
    void setUp() {
        testPackage = new TravelPackage();
        testPackage.setPackageId(1);
        testPackage.setPackageName("Goa Special");
        testPackage.setCost(15000.0);
        testPackage.setDuration("5 days");
        testPackage.setDescription("Amazing Goa trip");
        testPackage.setDestinationId(1);
        testPackage.setCompanyId(1);
    }

    @Test
    void testAddPackage_Success() {
        when(packageService.addPackage(any(TravelPackage.class))).thenReturn(testPackage);

        TravelPackage result = packageController.addPackage(testPackage);

        assertNotNull(result);
        assertEquals(1, result.getPackageId());
        assertEquals("Goa Special", result.getPackageName());
        verify(packageService, times(1)).addPackage(testPackage);
    }

    @Test
    void testUpdatePackage_Success() {
        when(packageService.updatePackage(anyInt(), any(TravelPackage.class))).thenReturn(testPackage);

        TravelPackage result = packageController.updatePackage(1, testPackage);

        assertNotNull(result);
        assertEquals(1, result.getPackageId());
        verify(packageService, times(1)).updatePackage(1, testPackage);
    }

    @Test
    void testDeletePackage_Success() {
        when(packageService.deletePackage(1)).thenReturn(true);

        String result = packageController.deletePackage(1);

        assertEquals("Package deleted successfully", result);
        verify(packageService, times(1)).deletePackage(1);
    }

    @Test
    void testDeletePackage_NotFound() {
        when(packageService.deletePackage(999)).thenReturn(false);

        String result = packageController.deletePackage(999);

        assertEquals("Package not found", result);
        verify(packageService, times(1)).deletePackage(999);
    }

    @Test
    void testGetAllPackages_Success() {
        TravelPackage package2 = new TravelPackage();
        package2.setPackageId(2);
        package2.setPackageName("Kerala Tour");
        
        List<TravelPackage> packages = Arrays.asList(testPackage, package2);
        when(packageService.findAllPackages()).thenReturn(packages);

        List<TravelPackage> result = packageController.getAllPackages();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(packageService, times(1)).findAllPackages();
    }

    @Test
    void testGetPackageById_Success() {
        when(packageService.getPackageById(1)).thenReturn(testPackage);

        TravelPackage result = packageController.getPackageById(1);

        assertNotNull(result);
        assertEquals(1, result.getPackageId());
        assertEquals("Goa Special", result.getPackageName());
        verify(packageService, times(1)).getPackageById(1);
    }

    @Test
    void testGetPackageById_NotFound() {
        when(packageService.getPackageById(999)).thenThrow(new RuntimeException("Package not found"));

        assertThrows(RuntimeException.class, () -> {
            packageController.getPackageById(999);
        });
        verify(packageService, times(1)).getPackageById(999);
    }
}
