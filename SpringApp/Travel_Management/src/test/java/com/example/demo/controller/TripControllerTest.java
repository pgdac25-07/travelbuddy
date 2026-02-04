package com.example.demo.controller;

import com.example.demo.entity.Trip;
import com.example.demo.service.TripService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripControllerTest {

    @Mock
    private TripService tripService;

    @InjectMocks
    private TripController tripController;

    private Trip testTrip1;
    private Trip testTrip2;

    @BeforeEach
    void setUp() {
        testTrip1 = new Trip();
        testTrip1.setTripId(1);
        testTrip1.setPackageId(1);
        testTrip1.setStartDate(LocalDate.now().plusDays(10));
        testTrip1.setEndDate(LocalDate.now().plusDays(15));

        testTrip2 = new Trip();
        testTrip2.setTripId(2);
        testTrip2.setPackageId(1);
        testTrip2.setStartDate(LocalDate.now().plusDays(20));
        testTrip2.setEndDate(LocalDate.now().plusDays(25));
    }

    @Test
    void testAddTrip_Success() {
        when(tripService.addTrip(any(Trip.class))).thenReturn(testTrip1);

        Trip result = tripController.addTrip(testTrip1);

        assertNotNull(result);
        assertEquals(1, result.getTripId());
        assertEquals(1, result.getPackageId());
        verify(tripService, times(1)).addTrip(testTrip1);
    }

    @Test
    void testGetAllTrips_Success() {
        List<Trip> trips = Arrays.asList(testTrip1, testTrip2);
        when(tripService.getAllTrips()).thenReturn(trips);

        List<Trip> result = tripController.getAllTrips();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(tripService, times(1)).getAllTrips();
    }

    @Test
    void testGetTripsByPackage_Success() {
        List<Trip> trips = Arrays.asList(testTrip1, testTrip2);
        when(tripService.getTripsByPackage(1)).thenReturn(trips);

        List<Trip> result = tripController.getTripsByPackage(1);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(tripService, times(1)).getTripsByPackage(1);
    }

    @Test
    void testGetTripsByPackage_Empty() {
        when(tripService.getTripsByPackage(999)).thenReturn(Arrays.asList());

        List<Trip> result = tripController.getTripsByPackage(999);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(tripService, times(1)).getTripsByPackage(999);
    }
}
