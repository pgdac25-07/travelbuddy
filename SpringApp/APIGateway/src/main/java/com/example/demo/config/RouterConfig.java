package com.example.demo.config;

import java.util.Arrays;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class RouterConfig {
	
	@Bean
	public RouteLocator createRoutes(RouteLocatorBuilder builder) {
		
		return builder.routes()
			   .route("Authentication", r-> r.path("/auth/**")
					   .uri("http://localhost:8081"))
					   //.uri("lb://Authentication"))
			   .route("Travel_Management", r-> r.path("/travelmgnt/**")
					   .uri("http://localhost:8082"))
//					   .uri("lb://Travel_Management"))
			   .route("Admin", r-> r.path("/admin/**")
					   .uri("http://localhost:8082"))
//					   .uri("lb://Travel_Management"))
			   .route("Feedback", r -> r
					    .path("/api/Feedback/**")
					    .uri("http://localhost:8083")
					)
			   
			   


			   .build();

		
	}
	
	@Bean
	public CorsWebFilter corsWebFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
		config.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
		config.setAllowedHeaders(Arrays.asList("Authorization","Content-Type"));
		config.setExposedHeaders(Arrays.asList("Authorization"));
		source.registerCorsConfiguration("/**", config);
		return new CorsWebFilter(source);
		
		
	}

}
