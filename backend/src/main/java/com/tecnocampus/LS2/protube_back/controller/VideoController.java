package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.service.VideoService;
import com.tecnocampus.LS2.protube_back.service.dto.VideoDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoMetaDataDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoUpdateDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
@Tag(name = "Video", description = "Video API")
public class VideoController {
    private static final Logger logger = LoggerFactory.getLogger(VideoController.class);
    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @Operation(summary = "Get all videos and return a list of VideoDTO")
    @GetMapping()
    public List<VideoDTO> getVideos() {
        return videoService.getVideos();
    }

    @GetMapping("/{id}")
    public VideoMetaDataDTO getVideo(@PathVariable Long id) {
        return videoService.getVideoMeta(id);
    }

    @Operation(summary = "Update a video given an id and a metaDTO")
    @PutMapping("/{id}")
    public VideoUpdateDTO updateVideo(@PathVariable Long id, Principal principal, @RequestBody VideoUpdateDTO videoUpdateDTO) {
        return videoService.updateVideo(id,principal.getName(), videoUpdateDTO);
    }

    @Operation(summary = "Get Videos by author")
    @GetMapping("/author")
    public List<VideoDTO> getVideosByAuthor(Principal principal) throws Exception {
        return videoService.getVideosByAuthor(principal.getName());
    }

}
