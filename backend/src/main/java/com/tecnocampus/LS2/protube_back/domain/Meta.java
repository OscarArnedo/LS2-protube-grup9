package com.tecnocampus.LS2.protube_back.domain;

import com.tecnocampus.LS2.protube_back.service.dto.MetaDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "video_meta")
public class Meta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Video video;

    private String description;

    public Meta(MetaDTO metaDTO) {
        this.description = metaDTO.getDescription();
    }
}
