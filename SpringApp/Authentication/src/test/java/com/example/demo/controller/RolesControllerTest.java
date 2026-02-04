package com.example.demo.controller;

import com.example.demo.entity.Roles;
import com.example.demo.service.RolesService;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RolesControllerTest {

    @Mock
    private RolesService rolesService;

    @InjectMocks
    private RolesController rolesController;

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
    void testCreateRole_Success() {
        when(rolesService.saveRole(any(Roles.class))).thenReturn(testRole1);

        Roles result = rolesController.createRole(testRole1);

        assertNotNull(result);
        assertEquals(1, result.getRoleId());
        assertEquals("CUSTOMER", result.getRname());
        verify(rolesService, times(1)).saveRole(testRole1);
    }

    @Test
    void testGetAllRoles_Success() {
        List<Roles> rolesList = Arrays.asList(testRole1, testRole2);
        when(rolesService.getAllRoles()).thenReturn(rolesList);

        List<Roles> result = rolesController.getAllRoles();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(rolesService, times(1)).getAllRoles();
    }

    @Test
    void testGetAllRoles_Empty() {
        when(rolesService.getAllRoles()).thenReturn(Arrays.asList());

        List<Roles> result = rolesController.getAllRoles();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(rolesService, times(1)).getAllRoles();
    }

    @Test
    void testGetRoleById_Success() {
        when(rolesService.getRoleById(1)).thenReturn(testRole1);

        Roles result = rolesController.getRoleById(1);

        assertNotNull(result);
        assertEquals(1, result.getRoleId());
        assertEquals("CUSTOMER", result.getRname());
        verify(rolesService, times(1)).getRoleById(1);
    }

    @Test
    void testGetRoleById_NotFound() {
        when(rolesService.getRoleById(999)).thenReturn(null);

        Roles result = rolesController.getRoleById(999);

        assertNull(result);
        verify(rolesService, times(1)).getRoleById(999);
    }
}
