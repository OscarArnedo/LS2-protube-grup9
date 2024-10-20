package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import com.tecnocampus.LS2.protube_back.service.exception.UserNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDTO createUser(UserDTO userDTO) {
        User user = new User(userDTO);
        return new UserDTO(userRepository.save(user));
    }

    public UserDTO getUser(String id) {
        return new UserDTO(userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id)));
    }

    public List<UserDTO> getUsers() {
        return userRepository.findAll().stream().map(UserDTO::new).toList();
    }

    public UserDTO updateUser(String id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
        //TODO Validate if the userDTO is valid

        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());

        return new UserDTO(userRepository.save(user));
    }

    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
        userRepository.delete(user);
    }
}
