package com.tecnocampus.LS2.protube_back.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tecnocampus.LS2.protube_back.domain.Video;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VideoDTO {
    private Long id;
    private String title;
    private String username;
    private String imagePath;
    private UserDTO owner;

    public VideoDTO() {
    }
    public VideoDTO(Video video) {
        this.id = video.getId();
        this.title = video.getTitle();
        this.username = video.getOwner().getName();
        this.imagePath = video.getImagePath();
    }

    @Override
    public String toString() {
        return "VideoDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", username='" + username + '\'' +
                ", imagePath='" + imagePath + '\'' +
                ", owner=" + owner +
                '}';
    }
}
