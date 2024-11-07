package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.*;
import com.tecnocampus.LS2.protube_back.persistance.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserSecurityRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import com.tecnocampus.LS2.protube_back.service.exception.UserNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserSecurityRepository userSecurityRepository;
    private final CommentRepository commentRepository;
    private final VideoRepository videoRepository;

    public UserService(UserRepository userRepository, UserSecurityRepository userSecurityRepository, CommentRepository commentRepository, VideoRepository videoRepository) {
        this.userRepository = userRepository;
        this.userSecurityRepository = userSecurityRepository;
        this.commentRepository = commentRepository;
        this.videoRepository = videoRepository;
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

    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));

        List<Comment> comments = commentRepository.getCommentsByAuthorId(id);
        commentRepository.deleteAll(comments);

        List<Video> videos = videoRepository.getVideosByOwner(user);
        videoRepository.deleteAll(videos);

        userSecurityRepository.delete(userSecurityRepository.findByEmail(user.getEmail()).orElseThrow(()->
                new UserNotFoundException(user.getEmail())));

        userRepository.delete(user);
    }
}
