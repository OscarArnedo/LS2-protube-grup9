package com.tecnocampus.LS2.protube_back.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tecnocampus.LS2.protube_back.domain.Video;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
public class VideoMetaDataDTO {
    private Long id;
    private String title;
    private Long height;
    private Long width;
    private Long duration;
    private UserDTO owner;
    private String videoPath;
    private String imagePath;
    private List<CommentDTO> comments;
    private String description;
    private List<String> tags;
    private String categories;

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

}
