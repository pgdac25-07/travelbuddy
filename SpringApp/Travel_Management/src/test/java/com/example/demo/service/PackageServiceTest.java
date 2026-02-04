package com.example.demo.service;

import com.example.demo.entity.TravelPackage;
import com.example.demo.repository.PackageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PackageServiceTest {

    @Mock
    private PackageRepository packageRepository;

    @InjectMocks
    private PackageService packageService;

    private TravelPackage testPackage;
    private TravelPackage updatedPackage;

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

        updatedPackage = new TravelPackage();
        updatedPackage.setPackageName("Goa Premium");
        updatedPackage.setCost(20000.0);
        updatedPackage.setDuration("7 days");
        updatedPackage.setDescription("Premium Goa experience");
        updatedPackage.setDestinationId(1);
    }

    @Test
    void testAddPackage_Success() {
        when(packageRepository.save(any(TravelPackage.class))).thenReturn(testPackage);

        TravelPackage result = packageService.addPackage(testPackage);

        assertNotNull(result);
        assertEquals(1, result.getPackageId());
        assertEquals("Goa Special", result.getPackageName());
        verify(packageRepository, times(1)).save(testPackage);
    }

    @Test
    void testUpdatePackage_Success() {
        when(packageRepository.findById(1)).thenReturn(Optional.of(testPackage));
        when(packageRepository.save(any(TravelPackage.class))).thenReturn(testPackage);

        TravelPackage result = packageService.updatePackage(1, updatedPackage);

        assertNotNull(result);
        verify(packageRepository, times(1)).findById(1);
        verify(packageRepository, times(1)).save(any(TravelPackage.class));
    }

    @Test
    void testUpdatePackage_NotFound() {
        when(packageRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            packageService.updatePackage(999, updatedPackage);
        });
        verify(packageRepository, times(1)).findById(999);
        verify(packageRepository, never()).save(any(TravelPackage.class));
    }

    @Test
    void testDeletePackage_Success() {
        when(packageRepository.existsById(1)).thenReturn(true);
        doNothing().when(packageRepository).deleteById(1);

        boolean result = packageService.deletePackage(1);

        assertTrue(result);
        verify(packageRepository, times(1)).existsById(1);
        verify(packageRepository, times(1)).deleteById(1);
    }

    @Test
    void testDeletePackage_NotFound() {
        when(packageRepository.existsById(999)).thenReturn(false);

        boolean result = packageService.deletePackage(999);

        assertFalse(result);
        verify(packageRepository, times(1)).existsById(999);
        verify(packageRepository, never()).deleteById(anyInt());
    }

    @Test
    void testFindAllPackages_Success() {
        TravelPackage package2 = new TravelPackage();
        package2.setPackageId(2);
        package2.setPackageName("Kerala Tour");

        List<TravelPackage> packages = Arrays.asList(testPackage, package2);
        when(packageRepository.findAll()).thenReturn(packages);

        List<TravelPackage> result = packageService.findAllPackages();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(packageRepository, times(1)).findAll();
    }

    @Test
    void testGetPackageById_Success() {
        when(packageRepository.findById(1)).thenReturn(Optional.of(testPackage));

        TravelPackage result = packageService.getPackageById(1);

        assertNotNull(result);
        assertEquals(1, result.getPackageId());
        assertEquals("Goa Special", result.getPackageName());
        verify(packageRepository, times(1)).findById(1);
    }

    @Test
    void testGetPackageById_NotFound() {
        when(packageRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            packageService.getPackageById(999);
        });
        verify(packageRepository, times(1)).findById(999);
    }
}
