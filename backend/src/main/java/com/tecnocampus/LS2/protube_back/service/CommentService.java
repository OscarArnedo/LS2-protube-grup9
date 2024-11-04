package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.Comment;
import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.persistance.CommentRepository;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.service.dto.CommentDTO;
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
        Video video = videoRepository.findById(commentDTO.getVideoId()).orElseThrow(() -> new Exception("Video not found"));
        User author = userRepository.findById(commentDTO.getAuthor().getId()).orElseThrow(() -> new Exception("User not found"));

        Comment comment = new Comment(commentDTO);
        comment.setVideo(video);
        comment.setAuthor(author);
        comment = commentRepository.save(comment);
        return new CommentDTO(comment);
    }

    public CommentDTO updateComment(Long commentId, String newText) throws Exception {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new Exception("Comment not found"));
        comment.setComment_text(newText);
        comment = commentRepository.save(comment);
        return new CommentDTO(comment);
    }

    public void deleteComment(Long commentId) throws Exception {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new Exception("Comment not found"));
        commentRepository.delete(comment);
    }
}
