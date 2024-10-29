package com.tecnocampus.LS2.protube_back.service.dto;

import com.tecnocampus.LS2.protube_back.domain.Comment;
import com.tecnocampus.LS2.protube_back.domain.Video;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentDTO {
    private Long id;
    private String comment_text;
    private String comment_author;

    public CommentDTO(Comment comment) {
        this.id = comment.getId();
        this.comment_text = comment.getComment_text();
        this.comment_author = comment.getComment_author();
    }
}
