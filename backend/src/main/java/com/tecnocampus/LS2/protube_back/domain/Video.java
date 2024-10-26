package com.tecnocampus.LS2.protube_back.domain;

import com.tecnocampus.LS2.protube_back.service.dto.VideoDTO;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "videos")
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long width;
    private Long height;
    private Long duration;
    private String title;
    private String username;

    public Video() {
    }
    public Video(VideoDTO videoDTO) {
        this.id = videoDTO.getId();
        this.width = videoDTO.getWidth();
        this.height = videoDTO.getHeight();
        this.duration = videoDTO.getDuration();
        this.title = videoDTO.getTitle();
        this.username = videoDTO.getUsername();
    }
}
