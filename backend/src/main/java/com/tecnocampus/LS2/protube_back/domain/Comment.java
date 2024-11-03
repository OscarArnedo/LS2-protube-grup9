package com.tecnocampus.LS2.protube_back.domain;

import com.tecnocampus.LS2.protube_back.service.dto.CommentDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "video_comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Video video;

    private String comment_text;
    private String comment_authorId;

    public Comment(CommentDTO commentDTO) {
        this.comment_text = commentDTO.getComment_text();
        this.comment_authorId = commentDTO.getComment_authorId();
    }
}
