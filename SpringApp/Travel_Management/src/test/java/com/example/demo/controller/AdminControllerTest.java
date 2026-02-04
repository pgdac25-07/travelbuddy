package com.example.demo.controller;

import com.example.demo.entity.Booking;
import com.example.demo.entity.Traveller;
import com.example.demo.entity.Users;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.TravellerRepository;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TravellerRepository travellerRepository;

    @InjectMocks
    private AdminController adminController;

    private Users pendingCompany;
    private Users approvedCompany;
    private Users customer;
    private Booking testBooking;
    private Traveller testTraveller;

    @BeforeEach
    void setUp() {
        pendingCompany = new Users();
        pendingCompany.setUserId(1);
        pendingCompany.setUsername("company1");
        pendingCompany.setRoleId(2);
        pendingCompany.setStatus("PENDING");

        approvedCompany = new Users();
        approvedCompany.setUserId(2);
        approvedCompany.setUsername("company2");
        approvedCompany.setRoleId(2);
        approvedCompany.setStatus("APPROVED");

        customer = new Users();
        customer.setUserId(3);
        customer.setUsername("customer1");
        customer.setRoleId(1);
        customer.setStatus("ACTIVE");

        testBooking = new Booking();
        testBooking.setBookingId(1);
        testBooking.setCustomerId(1);
        testBooking.setTripId(1);
        testBooking.setBookingDate(LocalDate.now());
        testBooking.setPaymentStatus("PENDING");

        testTraveller = new Traveller();
        testTraveller.setTravellerId(1);
        testTraveller.setBookingId(1);
        testTraveller.setFname("John");
        testTraveller.setLname("Doe");
    }

    @Test
    void testGetPendingCompanies_Success() {
        List<Users> users = Arrays.asList(pendingCompany, approvedCompany, customer);
        when(userRepository.findAll()).thenReturn(users);

        List<Users> result = adminController.getPendingCompanies();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("PENDING", result.get(0).getStatus());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetAllCompanies_Success() {
        List<Users> users = Arrays.asList(pendingCompany, approvedCompany, customer);
        when(userRepository.findAll()).thenReturn(users);

        List<Users> result = adminController.getAllCompanies();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(u -> u.getRoleId() == 2));
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetAllCustomers_Success() {
        List<Users> users = Arrays.asList(pendingCompany, approvedCompany, customer);
        when(userRepository.findAll()).thenReturn(users);

        List<Users> result = adminController.getAllCustomers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getRoleId());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testApproveCompany_Success() {
        when(userRepository.findById(1)).thenReturn(java.util.Optional.of(pendingCompany));
        when(userRepository.save(any(Users.class))).thenAnswer(invocation -> {
            Users user = invocation.getArgument(0);
            user.setStatus("APPROVED");
            return user;
        });

        ResponseEntity<Map<String, String>> response = adminController.approveCompany(1);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("Company approved successfully", response.getBody().get("message"));
        verify(userRepository, times(1)).findById(1);
        verify(userRepository, times(1)).save(any(Users.class));
    }

    @Test
    void testApproveCompany_NotFound() {
        when(userRepository.findById(999)).thenReturn(java.util.Optional.empty());

        ResponseEntity<Map<String, String>> response = adminController.approveCompany(999);

        assertEquals(400, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("User not found", response.getBody().get("message"));
        verify(userRepository, times(1)).findById(999);
        verify(userRepository, never()).save(any(Users.class));
    }

    @Test
    void testGetAllBookingsWithDetails_Success() {
        List<Booking> bookings = Arrays.asList(testBooking);
        when(bookingRepository.findAll()).thenReturn(bookings);

        List<Booking> result = adminController.getAllBookingsWithDetails();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(bookingRepository, times(1)).findAll();
    }

    @Test
    void testGetAllBookingsWithDetails_Empty() {
        when(bookingRepository.findAll()).thenReturn(Arrays.asList());

        List<Booking> result = adminController.getAllBookingsWithDetails();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
