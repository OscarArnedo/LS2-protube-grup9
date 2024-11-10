package com.tecnocampus.LS2.protube_back.service.dto;

import com.tecnocampus.LS2.protube_back.domain.Comment;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CommentDTO {
    private Long id;
    private Long videoId;
    private String comment_text;
    private UserDTO author;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.videoId = comment.getVideo().getId();
        this.comment_text = comment.getComment_text();
        this.author = new UserDTO(comment.getAuthor());
    }
}
