package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.service.UserService;
import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "User API")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Create a user given a userDTO")
    @PostMapping("/create")
    public UserDTO createUser(@RequestBody UserDTO userDTO) {
        return userService.createUser(userDTO);
    }

    @Operation(summary = "Get a user given an id")
    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable String id) {
        return userService.getUser(id);
    }

    @Operation(summary = "Get all users")
    @GetMapping()
    public List<UserDTO> getUsers() {
        return userService.getUsers();
    }

    @Operation(summary = "Get user by principal")
    @GetMapping("/userDetails")
    public UserDTO getUserDetails(Principal principal) {
        return userService.getUserDetails(principal.getName());
    }

    @Operation(summary = "Update logged user given a userDTO")
    @PutMapping()
    public UserDTO updateUser(Principal principal,@RequestBody UserDTO userDTO) {
        return userService.updateUser(principal.getName(), userDTO);
    }

    @Operation(summary = "Delete logged user")
    @DeleteMapping()
    public void deleteUser(Principal principal) {
        userService.deleteUser(principal.getName());
    }
}
