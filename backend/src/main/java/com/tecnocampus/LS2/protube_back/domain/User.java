package com.tecnocampus.LS2.protube_back.domain;

import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    private String id = UUID.randomUUID().toString();

    @Column(unique = true)
    private String name;

    @Email
    private String email;

    public User() {
    }

    public User(UserDTO userDTO) {
        this.name = userDTO.getName();
        this.email = userDTO.getEmail();
    }

}
