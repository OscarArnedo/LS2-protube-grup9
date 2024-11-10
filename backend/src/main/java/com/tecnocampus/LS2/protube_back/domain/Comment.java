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

    @ManyToOne
    @JoinColumn(name = "comment_author")
    private User author;

    public Comment(CommentDTO commentDTO) {
        this.comment_text = commentDTO.getComment_text();
    }
}
