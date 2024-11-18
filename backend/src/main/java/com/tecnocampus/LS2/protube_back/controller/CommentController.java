package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.service.CommentService;
import com.tecnocampus.LS2.protube_back.service.dto.CommentDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/comments")
@Tag(name = "Comment", description = "Comment API")
public class CommentController {
    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public CommentDTO createComment(@RequestBody CommentDTO commentDTO) throws Exception {
        return commentService.createComment(commentDTO);
    }

    @PatchMapping("/{commentId}/text")
    public CommentDTO updateComment(@PathVariable Long commentId, @RequestBody String text, Principal principal) throws Exception {
        JSONObject jsonObject = new JSONObject(text);
        return commentService.updateComment(commentId, jsonObject.getString("text"), principal.getName());
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId) throws Exception {
        commentService.deleteComment(commentId);
    }
}
