package com.example.zoning_tool.exception;

public class ZoningUpdateException extends RuntimeException {
    public ZoningUpdateException(String message) {
        super(message);
    }

    public ZoningUpdateException(String message, Throwable cause) {
        super(message, cause);
    }
}
