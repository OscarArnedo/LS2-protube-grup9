package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.*;
import com.tecnocampus.LS2.protube_back.persistance.*;
import com.tecnocampus.LS2.protube_back.service.dto.CommentDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoMetaDataDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoUpdateDTO;
import com.tecnocampus.LS2.protube_back.service.exception.EntityNotFound;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class VideoService {
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final MetaRepository metaRepository;
    private final TagRepository tagRepository;
    private final CategoryRepository categoryRepository;

    public VideoService(VideoRepository videoRepository, UserRepository userRepository,
                        CommentRepository commentRepository, MetaRepository metaRepository,
                        TagRepository tagRepository, CategoryRepository categoryRepository) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.metaRepository = metaRepository;
        this.tagRepository = tagRepository;
        this.categoryRepository = categoryRepository;
    }
    public List<VideoDTO> getVideos(){
        List<Video> videos = videoRepository.findAll();
        return videos.stream().map(video -> {
            VideoDTO videoDTO = new VideoDTO(video);;
            return videoDTO;
        }).collect(Collectors.toList());
    }

    public VideoUpdateDTO updateVideo(Long id, String name, VideoUpdateDTO videoMetaDataDTO) {
        User user = userRepository.findByName(name).orElseThrow(() -> new EntityNotFound(User.class, "name", name));
        Video video = videoRepository.findById(id).orElseThrow(() -> new EntityNotFound(Video.class, "id", id));
        Meta meta = metaRepository.getMetaByVideoId(id);
        if(!Objects.equals(user.getName(), video.getOwner().getName())){
            throw new RuntimeException("You are not the owner of the video!");
        }
        meta.setDescription(videoMetaDataDTO.getDescription());
        metaRepository.save(meta);
        video.setTitle(videoMetaDataDTO.getTitle());
        videoRepository.save(video);
        return new VideoUpdateDTO(video, meta);
    }

    public VideoMetaDataDTO getVideoMeta(Long id) {
        Video video = videoRepository.findById(id).orElseThrow(() -> new EntityNotFound(Video.class, "id", id));
        List<Comment> comments = commentRepository.getCommentsByVideoIdOrderByIdDesc(id);
        VideoMetaDataDTO videoMetaDataDTO = new VideoMetaDataDTO(video);

        Meta meta = metaRepository.getMetaByVideoId(id);
        List<Tag> tags = tagRepository.getTagsByVideoId(id);
        Category category = categoryRepository.getCategoryByVideoId(id);

        videoMetaDataDTO.setComments(comments.stream().map(comment -> new CommentDTO(comment)).collect(Collectors.toList()));
        videoMetaDataDTO.setDescription(meta.getDescription());
        videoMetaDataDTO.setTags(tags.stream().map(tag -> tag.getTag()).collect(Collectors.toList()));
        videoMetaDataDTO.setCategories(category.getCategory());

        return videoMetaDataDTO;
    }

    public List<VideoDTO> getVideosByAuthor(String name) throws Exception {
        User author = userRepository.findByName(name).orElseThrow(() -> new EntityNotFound(User.class, "name", name));
        List<Video> videos = videoRepository.getVideosByOwner(author);
        return videos.stream().map(VideoDTO::new).collect(Collectors.toList());
    }
}
