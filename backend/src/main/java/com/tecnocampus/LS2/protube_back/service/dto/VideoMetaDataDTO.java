package com.tecnocampus.LS2.protube_back.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tecnocampus.LS2.protube_back.domain.Video;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VideoMetaDataDTO {
    private Long id;
    private Long width;
    private Long height;
    private Long duration;
    private String videoPath;
    private String imagePath;
    private String title;
    private UserDTO owner;
    private List<CommentDTO> comments;

    public VideoMetaDataDTO() {
    }
    public VideoMetaDataDTO(Video video) {
        this.id = video.getId();
        this.width = video.getWidth();
        this.height = video.getHeight();
        this.duration = video.getDuration();
        this.title = video.getTitle();
        this.owner = new UserDTO(video.getOwner());
        this.videoPath = video.getVideoPath();
        this.imagePath = video.getImagePath();
    }

    @Override
    public String toString() {
        return "VideoMetaDataDTO{" +
                "id=" + id +
                ", width=" + width +
                ", height=" + height +
                ", duration=" + duration +
                ", videoPath='" + videoPath + '\'' +
                ", imagePath='" + imagePath + '\'' +
                ", title='" + title + '\'' +
                ", owner=" + owner +
                '}';
    }
}
