package com.tecnocampus.LS2.protube_back.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.service.VideoService;
import com.tecnocampus.LS2.protube_back.service.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @Operation(summary = "Delete a video given an id")
    @DeleteMapping("/{id}")
    public void deleteVideo(@PathVariable Long id, Principal principal) {
        videoService.deleteVideo(id, principal.getName());
    }
    @Operation(summary = "Create a Video")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<String> createVideo(
            Principal principal,
            @RequestPart("newVideoDTO") String newVideoDTO,
            @RequestPart("videoFile") MultipartFile videoFile,
            @RequestPart("imageFile") MultipartFile imageFile
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            NewVideoDTO parsedNewVideoDTO = objectMapper.readValue(newVideoDTO, NewVideoDTO.class);

            videoService.createVideo(principal.getName(), parsedNewVideoDTO, videoFile, imageFile);
        } catch (Exception e) {
            logger.error("Error creating video: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok("Video created successfully");
    }
    @Operation(summary = "Get all types of categories")
    @GetMapping("/categories")
    public List<String> getCategories() {
        return videoService.getCategories();
    }

    @Operation(summary = "Get all videos by category")
    @GetMapping("/category/{category}")
    public List<VideoDTO> getVideosByCategory(@PathVariable String category) {
        return videoService.getVideosByCategory(category);
    }

}
