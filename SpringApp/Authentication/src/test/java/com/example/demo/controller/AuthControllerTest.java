package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.Roles;
import com.example.demo.entity.Users;
import com.example.demo.repository.RolesRepository;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RolesRepository roleRepository;

    @Mock
    private HttpServletRequest httpServletRequest;

    @Mock
    private HttpSession httpSession;

    @InjectMocks
    private AuthController authController;

    private Users testUser;
    private Roles testRole;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testRole = new Roles();
        testRole.setRoleId(1);
        testRole.setRname("CUSTOMER");

        testUser = new Users();
        testUser.setUserId(1);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setEmail("test@example.com");
        testUser.setRoleId(1);
        testUser.setStatus("ACTIVE");
        testUser.setFname("Test");
        testUser.setLname("User");

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("newuser");
        registerRequest.setEmail("newuser@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setRoleId(1);
        registerRequest.setFirstName("New");
        registerRequest.setLastName("User");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");
    }

    @Test
    void testRegister_Success() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(Users.class))).thenReturn(testUser);
        when(httpServletRequest.getSession(anyBoolean())).thenReturn(httpSession);

        ResponseEntity<String> response = authController.register(registerRequest);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Registration successful", response.getBody());
        verify(userRepository, times(1)).save(any(Users.class));
    }

    @Test
    void testRegister_UsernameAlreadyExists() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        ResponseEntity<String> response = authController.register(registerRequest);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Username already exists", response.getBody());
        verify(userRepository, never()).save(any(Users.class));
    }

    @Test
    void testRegister_TravelCompanyStatusPending() {
        registerRequest.setRoleId(2); // TRAVEL_COMPANY
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(Users.class))).thenAnswer(invocation -> {
            Users user = invocation.getArgument(0);
            user.setUserId(1);
            user.setStatus("PENDING");
            return user;
        });

        ResponseEntity<String> response = authController.register(registerRequest);

        assertEquals(200, response.getStatusCode().value());
        verify(userRepository, times(1)).save(argThat(user -> 
            "PENDING".equals(user.getStatus())
        ));
    }

    @Test
    void testLogin_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(roleRepository.findById(1)).thenReturn(Optional.of(testRole));
        when(httpServletRequest.getSession(true)).thenReturn(httpSession);

        ResponseEntity<?> response = authController.login(loginRequest, httpServletRequest);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        verify(httpSession, times(1)).setAttribute("USER_ID", 1);
        verify(httpSession, times(1)).setAttribute("ROLE_ID", 1);
        verify(httpSession, times(1)).setAttribute("USERNAME", "testuser");
    }

    @Test
    void testLogin_InvalidUsername() {
        when(userRepository.findByUsername("invaliduser")).thenReturn(Optional.empty());
        loginRequest.setUsername("invaliduser");

        ResponseEntity<?> response = authController.login(loginRequest, httpServletRequest);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody() instanceof java.util.Map);
        verify(httpSession, never()).setAttribute(anyString(), any());
    }

    @Test
    void testLogin_InvalidPassword() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        loginRequest.setPassword("wrongpassword");

        ResponseEntity<?> response = authController.login(loginRequest, httpServletRequest);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody() instanceof java.util.Map);
        verify(httpSession, never()).setAttribute(anyString(), any());
    }

    @Test
    void testLogin_TravelCompanyPendingApproval() {
        testUser.setRoleId(2);
        testUser.setStatus("PENDING");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        ResponseEntity<?> response = authController.login(loginRequest, httpServletRequest);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody() instanceof java.util.Map);
        verify(httpSession, never()).setAttribute(anyString(), any());
    }

    @Test
    void testLogout_Success() {
        when(httpServletRequest.getSession(false)).thenReturn(httpSession);

        ResponseEntity<String> response = authController.logout(httpServletRequest);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Logout successful", response.getBody());
        verify(httpSession, times(1)).invalidate();
    }

    @Test
    void testLogout_NoSession() {
        when(httpServletRequest.getSession(false)).thenReturn(null);

        ResponseEntity<String> response = authController.logout(httpServletRequest);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Logout successful", response.getBody());
        verify(httpSession, never()).invalidate();
    }
}
