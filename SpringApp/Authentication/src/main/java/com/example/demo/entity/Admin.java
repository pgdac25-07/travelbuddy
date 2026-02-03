package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Integer adminId;

    @Column(name = "user_id", unique = true)
    private Integer userId;

    @Column(name = "admin_name")
    private String adminName;

    @Column(name = "status")
    private String status = "ACTIVE";
}
