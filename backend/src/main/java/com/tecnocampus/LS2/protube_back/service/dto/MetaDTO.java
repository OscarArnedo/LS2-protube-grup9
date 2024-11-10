package com.tecnocampus.LS2.protube_back.service.dto;

import com.tecnocampus.LS2.protube_back.domain.Meta;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MetaDTO {
    private long id;
    private long videoId;
    private String description;

    public MetaDTO(Meta meta) {
        this.id = meta.getId();
        this.videoId = meta.getVideo().getId();
        this.description = meta.getDescription();
    }
}
