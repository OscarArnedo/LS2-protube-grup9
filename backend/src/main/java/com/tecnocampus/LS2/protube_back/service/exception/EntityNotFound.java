package com.tecnocampus.LS2.protube_back.service.exception;

public class EntityNotFound extends RuntimeException{
    public EntityNotFound(Class entity, String fieldName, Object value ) {
        super(" Entity: " + entity.getName() + " not found with " + fieldName + " and value " + value);
    }
}
