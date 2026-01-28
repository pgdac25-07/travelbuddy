package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Roles;
import com.example.demo.service.RolesService;

@RestController
@RequestMapping("/roles")

public class RolesController {

	
	
	
	 @Autowired
	    private RolesService rolesService;

	    @PostMapping("/save")
	    public Roles createRole(@RequestBody Roles role) {
	        return rolesService.saveRole(role);
	    }

	    @GetMapping("/getall")
	    public List<Roles> getAllRoles() {
	        return rolesService.getAllRoles();
	    }

	    @GetMapping("/getbyid/{id}")
	    public Roles getRoleById(@PathVariable Integer id) {
	        return rolesService.getRoleById(id);
	    }
	
	
}
