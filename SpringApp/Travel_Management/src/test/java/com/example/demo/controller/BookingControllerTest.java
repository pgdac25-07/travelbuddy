package com.example.demo.controller;

import com.example.demo.dto.BookTripRequest;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Customer;
import com.example.demo.entity.TravelPackage;
import com.example.demo.entity.Trip;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.PackageRepository;
import com.example.demo.repository.TripRepository;
import com.example.demo.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private PackageRepository packageRepository;

    @InjectMocks
    private BookingController bookingController;

    private BookTripRequest bookTripRequest;
    private Customer testCustomer;
    private Booking testBooking;
    private Trip testTrip;
    private TravelPackage testPackage;

    @BeforeEach
    void setUp() {
        testCustomer = new Customer();
        testCustomer.setCustomerId(1);
        testCustomer.setUserId(100);
        testCustomer.setStatus("1");

        testPackage = new TravelPackage();
        testPackage.setPackageId(1);
        testPackage.setPackageName("Goa Special");

        testTrip = new Trip();
        testTrip.setTripId(1);
        testTrip.setPackageId(1);
        testTrip.setStartDate(LocalDate.now().plusDays(10));

        testBooking = new Booking();
        testBooking.setBookingId(1);
        testBooking.setCustomerId(1);
        testBooking.setTripId(1);
        testBooking.setBookingDate(LocalDate.now());
        testBooking.setPaymentStatus("PENDING");
        testBooking.setNoOfTravellers(2);

        bookTripRequest = new BookTripRequest();
        bookTripRequest.setCustomerId(100);
        bookTripRequest.setTripId(1);
        bookTripRequest.setIncludeSelf(false);
        bookTripRequest.setPaymentStatus("PENDING");
        bookTripRequest.setTravellers(new ArrayList<>());
    }

    @Test
    void testBookTrip_Success() {
    	when(bookingService.bookTrip(any()))
        .thenReturn("Trip booked successfully");


        String result = bookingController.bookTrip(bookTripRequest);

        assertEquals("Booking successful", result);
        verify(bookingService, times(1)).bookTrip(bookTripRequest);
    }

    @Test
    void testGetCustomerBookings_Success() {
        when(customerRepository.findByUserId(100)).thenReturn(Optional.of(testCustomer));
        when(bookingRepository.findAll()).thenReturn(Arrays.asList(testBooking));
        when(tripRepository.findById(1)).thenReturn(Optional.of(testTrip));
        when(packageRepository.findById(1)).thenReturn(Optional.of(testPackage));

        ResponseEntity<List<Map<String, Object>>> response = bookingController.getCustomerBookings(100);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(customerRepository, times(1)).findByUserId(100);
    }

    @Test
    void testGetCustomerBookings_CustomerNotFound() {
        when(customerRepository.findByUserId(999)).thenReturn(Optional.empty());

        ResponseEntity<List<Map<String, Object>>> response = bookingController.getCustomerBookings(999);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
        verify(customerRepository, times(1)).findByUserId(999);
    }

    @Test
    void testGetCustomerBookings_NoBookings() {
        when(customerRepository.findByUserId(100)).thenReturn(Optional.of(testCustomer));
        when(bookingRepository.findAll()).thenReturn(new ArrayList<>());

        ResponseEntity<List<Map<String, Object>>> response = bookingController.getCustomerBookings(100);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }
}
