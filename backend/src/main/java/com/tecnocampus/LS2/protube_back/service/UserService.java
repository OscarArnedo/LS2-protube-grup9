package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.ERole;
import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.domain.UserSecurity;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserSecurityRepository;
import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import com.tecnocampus.LS2.protube_back.service.exception.UserNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserSecurityRepository userSecurityRepository;

    public UserService(UserRepository userRepository, UserSecurityRepository userSecurityRepository) {
        this.userRepository = userRepository;
        this.userSecurityRepository = userSecurityRepository;
    }

    public UserDTO createUser(UserDTO userDTO) {
        User user = new User(userDTO);
        UserSecurity userSecurity = new UserSecurity(userDTO);
        userSecurity.setRole(ERole.USER);
        userSecurityRepository.save(userSecurity);
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
