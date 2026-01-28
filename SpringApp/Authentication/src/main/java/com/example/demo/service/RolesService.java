package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Roles;
import com.example.demo.repository.RolesRepository;

@Service
public class RolesService {
	
	
	@Autowired
    private RolesRepository rolesRepository;

    public Roles saveRole(Roles role) {
        return rolesRepository.save(role);
    }

    public List<Roles> getAllRoles() {
        return rolesRepository.findAll();
    }

    public Roles getRoleById(Integer id) {
        return rolesRepository.findById(id).orElse(null);
    }

}
