package com.tecnocampus.LS2.protube_back.controller;

import com.tecnocampus.LS2.protube_back.service.VideoService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class VideoController {
    private VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }
    @GetMapping("/videos")
    public ModelAndView getVideos() {
        List<String> videoTitles = videoService.getVideos();
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("videos");
        modelAndView.addObject("videoTitles", videoTitles);
        return modelAndView;
    }
}
