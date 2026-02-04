package com.example.demo.service;

import com.example.demo.dto.BookTripRequest;
import com.example.demo.dto.TravellerRequest;
import com.example.demo.entity.Booking;
import com.example.demo.entity.Customer;
import com.example.demo.entity.Traveller;
import com.example.demo.entity.Users;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.TravellerRepository;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepo;

    @Mock
    private TravellerRepository travellerRepo;

    @Mock
    private UserRepository userRepo;

    @Mock
    private CustomerRepository customerRepo;

    @InjectMocks
    private BookingService bookingService;

    private BookTripRequest bookTripRequest;
    private Customer testCustomer;
    private Users testUser;
    private TravellerRequest travellerRequest;

    @BeforeEach
    void setUp() {
        testCustomer = new Customer();
        testCustomer.setCustomerId(1);
        testCustomer.setUserId(100);
        testCustomer.setStatus("1");

        testUser = new Users();
        testUser.setUserId(100);
        testUser.setFname("John");
        testUser.setLname("Doe");

        travellerRequest = new TravellerRequest();
        travellerRequest.setFname("Jane");
        travellerRequest.setLname("Doe");
        travellerRequest.setBdate(LocalDate.of(1990, 1, 1));
        travellerRequest.setGender("F");

        bookTripRequest = new BookTripRequest();
        bookTripRequest.setCustomerId(100);
        bookTripRequest.setTripId(1);
        bookTripRequest.setIncludeSelf(false);
        bookTripRequest.setPaymentStatus("PENDING");
        bookTripRequest.setTravellers(Arrays.asList(travellerRequest));
    }

    @Test
    void testBookTrip_Success() {
        when(customerRepo.findByUserId(100)).thenReturn(Optional.of(testCustomer));
        when(bookingRepo.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setBookingId(1);
            return booking;
        });
        when(travellerRepo.save(any(Traveller.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = bookingService.bookTrip(bookTripRequest);

        assertEquals("Trip booked successfully", result);
        verify(customerRepo, times(1)).findByUserId(100);
        verify(bookingRepo, times(1)).save(any(Booking.class));
        verify(travellerRepo, times(1)).save(any(Traveller.class));
    }

    @Test
    void testBookTrip_WithIncludeSelf() {
        bookTripRequest.setIncludeSelf(true);
        when(customerRepo.findByUserId(100)).thenReturn(Optional.of(testCustomer));
        when(userRepo.findById(100)).thenReturn(Optional.of(testUser));
        when(bookingRepo.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setBookingId(1);
            return booking;
        });
        when(travellerRepo.save(any(Traveller.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = bookingService.bookTrip(bookTripRequest);

        assertEquals("Trip booked successfully", result);
        verify(travellerRepo, times(2)).save(any(Traveller.class)); // One for traveller, one for self
    }

    @Test
    void testBookTrip_CustomerNotFound() {

        // VERY IMPORTANT
        bookTripRequest.setCustomerId(999);

        when(customerRepo.findByUserId(999)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            bookingService.bookTrip(bookTripRequest);
        });

        verify(customerRepo, times(1)).findByUserId(999);
        verify(bookingRepo, never()).save(any());
    }

    @Test
    void testBookTrip_UserNotFound_WhenIncludeSelf() {
        bookTripRequest.setIncludeSelf(true);
        when(customerRepo.findByUserId(100)).thenReturn(Optional.of(testCustomer));
        when(bookingRepo.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setBookingId(1);
            return booking;
        });
        when(userRepo.findById(100)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            bookingService.bookTrip(bookTripRequest);
        });
    }

    @Test
    void testBookTrip_DefaultPaymentStatus() {
        bookTripRequest.setPaymentStatus(null);
        when(customerRepo.findByUserId(100)).thenReturn(Optional.of(testCustomer));
        when(bookingRepo.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setBookingId(1);
            return booking;
        });
        when(travellerRepo.save(any(Traveller.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = bookingService.bookTrip(bookTripRequest);

        assertEquals("Trip booked successfully", result);
        verify(bookingRepo, times(1)).save(argThat(booking -> 
            "PENDING".equals(booking.getPaymentStatus())
        ));
    }
}
