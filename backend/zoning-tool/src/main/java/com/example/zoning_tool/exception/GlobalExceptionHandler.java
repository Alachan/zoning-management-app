package com.example.zoning_tool.exception;

import com.example.zoning_tool.dto.ApiError;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.stream.Collectors;

/**
 * Global exception handler to centralize error responses across the application
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ApiError> handleIllegalArgumentException(IllegalArgumentException ex) {
                ApiError error = new ApiError(
                                HttpStatus.BAD_REQUEST.value(),
                                "Invalid request parameters",
                                ex.getMessage());
                return ResponseEntity.badRequest().body(error);
        }

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<ApiError> handleRuntimeException(RuntimeException ex) {
                ApiError error = new ApiError(
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "Application error",
                                ex.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

        @ExceptionHandler(ParcelNotFoundException.class)
        public ResponseEntity<ApiError> handleParcelNotFound(ParcelNotFoundException ex) {
                ApiError error = new ApiError(
                                HttpStatus.NOT_FOUND.value(),
                                "Resource not found",
                                ex.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        @ExceptionHandler(ZoningUpdateException.class)
        public ResponseEntity<ApiError> handleZoningUpdateException(ZoningUpdateException ex) {
                ApiError error = new ApiError(
                                HttpStatus.CONFLICT.value(),
                                "Failed to update zoning",
                                ex.getMessage());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiError> handleValidationExceptions(MethodArgumentNotValidException ex) {
                String details = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(FieldError::getDefaultMessage)
                                .collect(Collectors.joining(", "));

                ApiError error = new ApiError(
                                HttpStatus.BAD_REQUEST.value(),
                                "Validation error",
                                details);
                return ResponseEntity.badRequest().body(error);
        }

        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<ApiError> handleConstraintViolation(ConstraintViolationException ex) {
                String details = ex.getConstraintViolations()
                                .stream()
                                .map(ConstraintViolation::getMessage)
                                .collect(Collectors.joining(", "));

                ApiError error = new ApiError(
                                HttpStatus.BAD_REQUEST.value(),
                                "Constraint violation error",
                                details);
                return ResponseEntity.badRequest().body(error);
        }

        @ExceptionHandler(DataAccessException.class)
        public ResponseEntity<ApiError> handleDataAccessException(DataAccessException ex) {
                ApiError error = new ApiError(
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "Database error",
                                "An error occurred while accessing the database");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiError> handleGenericException(Exception ex) {
                ApiError error = new ApiError(
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "Internal server error",
                                "An unexpected error occurred");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
}