package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.*;
import com.tecnocampus.LS2.protube_back.persistance.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserSecurityRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import com.tecnocampus.LS2.protube_back.service.exception.EntityNotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserSecurityRepository userSecurityRepository;
    private final CommentRepository commentRepository;
    private final VideoRepository videoRepository;
    private final VideoService videoService;

    public UserService(UserRepository userRepository, UserSecurityRepository userSecurityRepository,
                       CommentRepository commentRepository, VideoRepository videoRepository, VideoService videoService) {
        this.userRepository = userRepository;
        this.userSecurityRepository = userSecurityRepository;
        this.commentRepository = commentRepository;
        this.videoRepository = videoRepository;
        this.videoService = videoService;
    }

    public UserDTO createUser(UserDTO userDTO) {
        User user = new User(userDTO);

        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());

        UserSecurity userSecurity = new UserSecurity(userDTO);
        userSecurity.setPassword(encodedPassword);
        userSecurity.setRole(ERole.USER);
        userSecurityRepository.save(userSecurity);
        return new UserDTO(userRepository.save(user));
    }

    public UserDTO getUser(String id) {
        return new UserDTO(userRepository.findById(id).orElseThrow(()->new EntityNotFound(User.class, "id", id)));
    }

    public List<UserDTO> getUsers() {
        return userRepository.findAll().stream().map(UserDTO::new).toList();
    }

    public UserDTO updateUser(String name, UserDTO userDTO) {
        User user = userRepository.findByName(name).orElseThrow(()->new EntityNotFound(User.class, "name", name));
        UserSecurity userSecurity = userSecurityRepository.findByEmail(user.getEmail()).orElseThrow(()->
                new EntityNotFound(UserSecurity.class, "email", user.getEmail()));

        if(userDTO.getPassword() != null  && !userDTO.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
            userSecurity.setPassword(encodedPassword);
        }
        if(userDTO.getName() != null && !userDTO.getName().isEmpty()) {
            user.setName(userDTO.getName());
            userSecurity.setUsername(userDTO.getName());
        }
        if(userDTO.getEmail() != null && !userDTO.getEmail().isEmpty()) {
            user.setEmail(userDTO.getEmail());
            userSecurity.setEmail(userDTO.getEmail());
        }
        userSecurityRepository.save(userSecurity);

        return new UserDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(String name) {
        User user = userRepository.findByName(name).orElseThrow(()->new EntityNotFound(User.class, "name", name));

        List<Comment> comments = commentRepository.getCommentsByAuthorId(user.getId());
        commentRepository.deleteAll(comments);

        List<Video> videos = videoRepository.getVideosByOwner(user);
        videos.forEach(video -> videoService.deleteVideo(video.getId(), user.getName()));

        userSecurityRepository.delete(userSecurityRepository.findByEmail(user.getEmail()).orElseThrow(()->
                new EntityNotFound(UserSecurity.class, "email", user.getEmail())));

        userRepository.delete(user);
    }

    public UserDTO getUserDetails(String name) {
        return new UserDTO(userRepository.findByName(name).orElseThrow(()->new EntityNotFound(User.class, "name", name)));
    }
}
