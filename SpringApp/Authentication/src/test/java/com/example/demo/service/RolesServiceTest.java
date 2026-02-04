package com.example.demo.service;

import com.example.demo.entity.Roles;
import com.example.demo.repository.RolesRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RolesServiceTest {

    @Mock
    private RolesRepository rolesRepository;

    @InjectMocks
    private RolesService rolesService;

    private Roles testRole1;
    private Roles testRole2;

    @BeforeEach
    void setUp() {
        testRole1 = new Roles();
        testRole1.setRoleId(1);
        testRole1.setRname("CUSTOMER");

        testRole2 = new Roles();
        testRole2.setRoleId(2);
        testRole2.setRname("TRAVEL_COMPANY");
    }

    @Test
    void testSaveRole_Success() {
        when(rolesRepository.save(any(Roles.class))).thenReturn(testRole1);

        Roles result = rolesService.saveRole(testRole1);

        assertNotNull(result);
        assertEquals(1, result.getRoleId());
        assertEquals("CUSTOMER", result.getRname());
        verify(rolesRepository, times(1)).save(testRole1);
    }

    @Test
    void testGetAllRoles_Success() {
        List<Roles> rolesList = Arrays.asList(testRole1, testRole2);
        when(rolesRepository.findAll()).thenReturn(rolesList);

        List<Roles> result = rolesService.getAllRoles();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(testRole1));
        assertTrue(result.contains(testRole2));
        verify(rolesRepository, times(1)).findAll();
    }

    @Test
    void testGetAllRoles_Empty() {
        when(rolesRepository.findAll()).thenReturn(Arrays.asList());

        List<Roles> result = rolesService.getAllRoles();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(rolesRepository, times(1)).findAll();
    }

    @Test
    void testGetRoleById_Success() {
        when(rolesRepository.findById(1)).thenReturn(Optional.of(testRole1));

        Roles result = rolesService.getRoleById(1);

        assertNotNull(result);
        assertEquals(1, result.getRoleId());
        assertEquals("CUSTOMER", result.getRname());
        verify(rolesRepository, times(1)).findById(1);
    }

    @Test
    void testGetRoleById_NotFound() {
        when(rolesRepository.findById(999)).thenReturn(Optional.empty());

        Roles result = rolesService.getRoleById(999);

        assertNull(result);
        verify(rolesRepository, times(1)).findById(999);
    }
}
