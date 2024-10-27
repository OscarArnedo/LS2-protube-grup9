package com.tecnocampus.LS2.protube_back.service.dto;

import com.tecnocampus.LS2.protube_back.domain.Video;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VideoMetaDataDTO {
    private Long id;
    private Long width;
    private Long height;
    private Long duration;
    private String title;
    private UserDTO owner;

    public VideoMetaDataDTO() {
    }
    public VideoMetaDataDTO(Video video) {
        this.id = video.getId();
        this.width = video.getWidth();
        this.height = video.getHeight();
        this.duration = video.getDuration();
        this.title = video.getTitle();
        this.owner = new UserDTO(video.getOwner());

    }

    @Override
    public String toString() {
        return "VideoDTO{" +
                "id=" + id +
                ", width=" + width +
                ", height=" + height +
                ", duration=" + duration +
                ", title='" + title + '\'' +
                ", owner=" + owner +
                '}';
    }
}
