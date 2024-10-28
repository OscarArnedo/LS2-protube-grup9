package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.User;
import com.tecnocampus.LS2.protube_back.domain.Video;
import com.tecnocampus.LS2.protube_back.persistance.UserRepository;
import com.tecnocampus.LS2.protube_back.persistance.VideoRepository;
import com.tecnocampus.LS2.protube_back.service.dto.VideoDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoMetaDataDTO;
import com.tecnocampus.LS2.protube_back.service.exception.ConvertImageException;
import com.tecnocampus.LS2.protube_back.service.exception.UserNotFoundException;
import com.tecnocampus.LS2.protube_back.service.exception.VideoNotFoundException;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VideoService {
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    public VideoService(VideoRepository videoRepository, UserRepository userRepository) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
    }
    public List<VideoDTO> getVideos(){
        List<Video> videos = videoRepository.findAll();
        return videos.stream().map(video -> {
            VideoDTO videoDTO = new VideoDTO(video);
            videoDTO.setImage(convertImageToBase64(video.getImagePath()));
            return videoDTO;
        }).collect(Collectors.toList());
    }

    public VideoDTO updateVideo(Long id, String name, VideoMetaDataDTO videoMetaDataDTO) {
        User user = userRepository.findByName(name).orElseThrow(() -> new UserNotFoundException(name));
        Video video = videoRepository.findById(id).orElseThrow(()->new VideoNotFoundException(id));
        if(!video.getOwner().getName().equals(user.getName())){
            throw new RuntimeException("You are not the owner of the video!!!");
        }
        video.setDuration(videoMetaDataDTO.getDuration());
        video.setHeight(videoMetaDataDTO.getHeight());
        video.setWidth(videoMetaDataDTO.getWidth());
        video.setTitle(videoMetaDataDTO.getTitle());

        return new VideoDTO(videoRepository.save(video));
    }

    public VideoMetaDataDTO getVideoMeta(Long id) {
        Video video = videoRepository.findById(id).orElseThrow(() -> new VideoNotFoundException(id));
        VideoMetaDataDTO videoMetaDataDTO = new VideoMetaDataDTO(video);
        videoMetaDataDTO.setImage(convertImageToBase64(video.getImagePath()));
        return videoMetaDataDTO;
    }

    private String convertImageToBase64(String imagePath) {
        try {
            File imageFile = new File(imagePath);
            byte[] imageBytes = Files.readAllBytes(imageFile.toPath());
            return Base64.getEncoder().encodeToString(imageBytes);
        } catch (IOException e) {
            throw new ConvertImageException("Error converting image at path " + imagePath + " to base64");
        }
    }
}
