package com.camsys.assetcloud.needsforecaster.controller.exceptions;

public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(String entityClassName, Long id) {
        super("Could not find " + entityClassName + ": " + id);
    }
}
