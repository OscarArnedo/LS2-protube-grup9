package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.service.VideoService;
import com.tecnocampus.LS2.protube_back.service.dto.VideoDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoMetaDataDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

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

    @Operation(summary = "Update a video given an id and a videoDTO")
    @PutMapping("/{id}")
    public VideoDTO updateVideo(@PathVariable Long id, Principal principal, @RequestBody VideoMetaDataDTO videoMetaDataDTO) {
        logger.info("Principal name: {}", principal.getName());
        return videoService.updateVideo(id,principal.getName(), videoMetaDataDTO);
    }

    @Operation(summary = "Get Videos by author")
    @GetMapping("/author")
    public List<VideoDTO> getVideosByAuthor(Principal principal) throws Exception {
        return videoService.getVideosByAuthor(principal.getName());
    }

    @Operation(summary = "Delete a video given an id")
    @DeleteMapping("/{id}")
    public void deleteVideo(@PathVariable Long id, Principal principal) {
        videoService.deleteVideo(id, principal.getName());
    }
}
