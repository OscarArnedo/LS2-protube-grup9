package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.service.UserService;
import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public UserDTO createUser(@RequestBody UserDTO userDTO) {
        System.out.println("Creating user: " + userDTO);
        return userService.createUser(userDTO);
    }

    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable String id) {
        return userService.getUser(id);
    }

    @GetMapping()
    public List<UserDTO> getUsers() {
        return userService.getUsers();
    }
}
