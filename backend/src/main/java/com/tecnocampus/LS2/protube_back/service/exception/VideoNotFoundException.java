package com.tecnocampus.LS2.protube_back.service.exception;

public class VideoNotFoundException extends RuntimeException {
    public VideoNotFoundException(long id) {
        super("Video with id " + id + " doesn't exist");
    }
}
