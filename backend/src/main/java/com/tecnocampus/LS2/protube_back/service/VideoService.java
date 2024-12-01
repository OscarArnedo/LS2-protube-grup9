package com.tecnocampus.LS2.protube_back.service;

import com.tecnocampus.LS2.protube_back.domain.*;
import com.tecnocampus.LS2.protube_back.persistance.*;
import com.tecnocampus.LS2.protube_back.service.dto.CommentDTO;
import com.tecnocampus.LS2.protube_back.service.dto.NewVideoDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoMetaDataDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoUpdateDTO;
import com.tecnocampus.LS2.protube_back.service.exception.EntityNotFound;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
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

    private final Environment env;

    public VideoService(VideoRepository videoRepository, UserRepository userRepository,
                        CommentRepository commentRepository, MetaRepository metaRepository,
                        TagRepository tagRepository, CategoryRepository categoryRepository,
                        Environment env) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.metaRepository = metaRepository;
        this.tagRepository = tagRepository;
        this.categoryRepository = categoryRepository;
        this.env = env;
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

    @Transactional
    public void deleteVideo(Long id, String name) {
        User user = userRepository.findByName(name).orElseThrow(() -> new EntityNotFound(User.class, "name", name));
        Video video = videoRepository.findById(id).orElseThrow(() -> new EntityNotFound(Video.class, "id", id));
        if (!video.getOwner().getName().equals(user.getName())) {
            throw new RuntimeException("You are not the owner of the video!!!");
        }

        // Delete comments associated with the video
        List<Comment> comments = commentRepository.getCommentsByVideoIdOrderByIdDesc(id);
        commentRepository.deleteAll(comments);

        // Delete tags associated with the video
        List<Tag> tags = tagRepository.getTagsByVideoId(id);
        tagRepository.deleteAll(tags);

        // Delete meta associated with the video
        Meta meta = metaRepository.getMetaByVideoId(id);
        if (meta != null) {
            metaRepository.delete(meta);
        }

        // Delete category associated with the video
        Category category = categoryRepository.getCategoryByVideoId(id);
        if (category != null) {
            categoryRepository.delete(category);
        }

        // Delete the video
        videoRepository.delete(video);
    }

    @Transactional
    public void createVideo(String name, NewVideoDTO newVideoDTO, MultipartFile videoFile, MultipartFile imageFile) throws IOException {
        User user = userRepository.findByName(name).orElseThrow(() -> new EntityNotFound(User.class, "name", name));
        Video video = new Video();
        video.setTitle(newVideoDTO.getTitle());
        video.setOwner(user);
        video.setDuration(30L);
        video.setHeight(1080L);
        video.setWidth(1920L);
        Video videoCreated = videoRepository.save(video);

        videoCreated.setVideoPath(saveFile(videoCreated.getId(), videoFile));
        videoCreated.setImagePath(saveFile(videoCreated.getId(), imageFile));
        videoRepository.save(videoCreated);

        Meta meta = new Meta();
        meta.setDescription(newVideoDTO.getDescription());
        meta.setVideo(videoCreated);
        metaRepository.save(meta);

        Category category = new Category();
        category.setCategory(newVideoDTO.getCategories());
        category.setVideo(videoCreated);
        categoryRepository.save(category);

        List<Tag> tags = newVideoDTO.getTags().stream().map(tag -> {
            Tag t = new Tag();
            t.setTag(tag);
            t.setVideo(videoCreated);
            return t;
        }).collect(Collectors.toList());
        tagRepository.saveAll(tags);
    }

    private String saveFile(Long videoId, MultipartFile videoFile) throws IOException {
        String fileName = videoId + "." + videoFile.getOriginalFilename().substring(videoFile.getOriginalFilename().lastIndexOf(".") + 1);
        File file = new File(env.getProperty("pro_tube.store.dir") + fileName);
        videoFile.transferTo(file);
        return fileName;
    }
}
