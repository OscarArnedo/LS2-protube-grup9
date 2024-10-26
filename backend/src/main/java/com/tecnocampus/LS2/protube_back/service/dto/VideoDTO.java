package com.tecnocampus.LS2.protube_back.service.dto;

import com.tecnocampus.LS2.protube_back.domain.Video;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VideoDTO {
    private Long id;
    private Long width;
    private Long height;
    private Long duration;
    private String title;
    private String username;

    public VideoDTO() {
    }
    public VideoDTO(Video video) {
        this.id = video.getId();
        this.width = video.getWidth();
        this.height = video.getHeight();
        this.duration = video.getDuration();
        this.title = video.getTitle();
        this.username = video.getUsername();

    }

    @Override
    public String toString() {
        return "VideoDTO{" +
                "id=" + id +
                ", width=" + width +
                ", height=" + height +
                ", duration=" + duration +
                ", title='" + title + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}
