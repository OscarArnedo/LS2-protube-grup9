package com.tecnocampus.LS2.protube_back.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tecnocampus.LS2.protube_back.domain.Meta;
import com.tecnocampus.LS2.protube_back.domain.Video;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VideoUpdateDTO {

    private String title;
    private String description;

    public VideoUpdateDTO(Video video, Meta meta) {
        this.title = video.getTitle();
        this.description = meta.getDescription();
    }
}
