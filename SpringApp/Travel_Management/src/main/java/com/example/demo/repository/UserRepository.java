package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByUsername(String username);
    Optional<Users> findByEmail(String email);
    

    List<Users> findByRole_Rname(String roleName);

    List<Users> findByStatus(String status);
}





