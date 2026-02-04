package com.example.demo.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.web.cors.reactive.CorsWebFilter;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RouterConfigTest {

    @Mock
    private RouteLocatorBuilder routeLocatorBuilder;

    @Mock
    private RouteLocatorBuilder.Builder builder;

    @Test
    void testRouterConfigCreation() {
        RouterConfig routerConfig = new RouterConfig();
        assertNotNull(routerConfig);
    }

    @Test
    void testCreateRoutes_NotNull() {
        RouterConfig routerConfig = new RouterConfig();
        RouteLocatorBuilder mockBuilder = mock(RouteLocatorBuilder.class);
        RouteLocatorBuilder.Builder mockRouteBuilder = mock(RouteLocatorBuilder.Builder.class);
        
        when(mockBuilder.routes()).thenReturn(mockRouteBuilder);
        when(mockRouteBuilder.route(anyString(), any())).thenReturn(mockRouteBuilder);
        when(mockRouteBuilder.build()).thenReturn(mock(RouteLocator.class));

        RouteLocator routeLocator = routerConfig.createRoutes(mockBuilder);
        
        assertNotNull(routeLocator);
    }

    @Test
    void testCorsWebFilterCreation() {
        RouterConfig routerConfig = new RouterConfig();
        CorsWebFilter corsWebFilter = routerConfig.corsWebFilter();
        
        assertNotNull(corsWebFilter);
    }
}
