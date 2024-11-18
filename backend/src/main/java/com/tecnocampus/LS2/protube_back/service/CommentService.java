package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.Comment;
import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.persistance.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.service.dto.CommentDTO;
import com.tecnocampus.LS2.protube_back.service.exception.EntityNotFound;
import org.springframework.stereotype.Service;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, VideoRepository videoRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
    }

    public CommentDTO createComment(CommentDTO commentDTO) throws Exception {
        Video video = videoRepository.findById(commentDTO.getVideoId()).orElseThrow(() -> new EntityNotFound(Video.class, "id", commentDTO.getVideoId().toString()));
        User author = userRepository.findById(commentDTO.getAuthor().getId()).orElseThrow(() -> new EntityNotFound(User.class, "id", commentDTO.getAuthor().getId().toString()));

        Comment comment = new Comment(commentDTO);
        comment.setVideo(video);
        comment.setAuthor(author);
        comment = commentRepository.save(comment);
        return new CommentDTO(comment);
    }

    public CommentDTO updateComment(Long commentId, String newText, String username) throws Exception {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new EntityNotFound(Comment.class, "id", commentId.toString()));
        if (!comment.getAuthor().getName().equals(username)) {
            throw new RuntimeException("You are not the author of the comment!");
        }
        comment.setComment_text(newText);
        comment = commentRepository.save(comment);
        return new CommentDTO(comment);
    }

    public void deleteComment(Long commentId) throws Exception {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new EntityNotFound(Comment.class, "id", commentId.toString()));
        commentRepository.delete(comment);
    }
}
