package com.example.demo.controller;

import com.example.demo.entity.Destination;
import com.example.demo.repository.DestinationRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DestinationControllerTest {

    @Mock
    private DestinationRepository destinationRepository;

    @InjectMocks
    private DestinationController destinationController;

    private Destination testDestination1;
    private Destination testDestination2;

    @BeforeEach
    void setUp() {
        testDestination1 = new Destination();
        testDestination1.setDestinationId(1);
        testDestination1.setDname("Goa");

        testDestination2 = new Destination();
        testDestination2.setDestinationId(2);
        testDestination2.setDname("Kerala");
    }

    @Test
    void testGetAllDestinations_Success() {
        List<Destination> destinations = Arrays.asList(testDestination1, testDestination2);
        when(destinationRepository.findAll()).thenReturn(destinations);

        List<Destination> result = destinationController.getAllDestinations();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(destinationRepository, times(1)).findAll();
    }

    @Test
    void testGetAllDestinations_Empty() {
        when(destinationRepository.findAll()).thenReturn(Arrays.asList());

        List<Destination> result = destinationController.getAllDestinations();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(destinationRepository, times(1)).findAll();
    }

    @Test
    void testGetDestinationById_Success() {
        when(destinationRepository.findById(1)).thenReturn(Optional.of(testDestination1));

        Destination result = destinationController.getDestinationById(1);

        assertNotNull(result);
        assertEquals(1, result.getDestinationId());
        assertEquals("Goa", result.getDname());
        verify(destinationRepository, times(1)).findById(1);
    }

    @Test
    void testGetDestinationById_NotFound() {
        when(destinationRepository.findById(999)).thenReturn(Optional.empty());

        Destination result = destinationController.getDestinationById(999);

        assertNull(result);
        verify(destinationRepository, times(1)).findById(999);
    }
}
