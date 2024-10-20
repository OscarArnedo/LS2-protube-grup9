package com.tecnocampus.LS2.protube_back.domain;

import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    private String id = UUID.randomUUID().toString();

    private String name;
    private String email;
    private String password;

    public User() {
    }
    public User(UserDTO userDTO) {
        this.name = userDTO.getName();
        this.email = userDTO.getEmail();
        this.password = userDTO.getPassword();
    }

}
