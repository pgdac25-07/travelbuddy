package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // Allow specific origin
        config.addAllowedOrigin("http://localhost:3000");
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow all HTTP methods including OPTIONS for preflight
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("PATCH");
        
        // Cache preflight response for 1 hour
        config.setMaxAge(3600L);
        
        // Apply to all paths
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
