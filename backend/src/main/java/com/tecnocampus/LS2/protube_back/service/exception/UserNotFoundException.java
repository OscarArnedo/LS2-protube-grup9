package com.tecnocampus.LS2.protube_back.service.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(String id){
        super("User with id " + id + " doesn't exist");
    }
}
