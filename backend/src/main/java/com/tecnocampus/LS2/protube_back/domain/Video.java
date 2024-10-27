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

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;


    public Video() {
    }
}
