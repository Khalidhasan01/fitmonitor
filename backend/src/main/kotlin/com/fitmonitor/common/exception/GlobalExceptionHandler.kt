package com.fitmonitor.common.exception

import com.fitmonitor.common.response.MessageResponse
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleNotFound(ex: ResourceNotFoundException): ResponseEntity<MessageResponse> {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(MessageResponse(ex.message ?: "Resource not found"))
    }

    @ExceptionHandler(ValidationException::class)
    fun handleValidationError(ex: ValidationException): ResponseEntity<MessageResponse> {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(MessageResponse(ex.message ?: "Validation error"))
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleBadRequest(ex: IllegalArgumentException): ResponseEntity<MessageResponse> {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(MessageResponse(ex.message ?: "Bad request"))
    }

    @ExceptionHandler(IllegalStateException::class)
    fun handleUnauthorized(ex: IllegalStateException): ResponseEntity<MessageResponse> {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(MessageResponse(ex.message ?: "Unauthorized"))
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<MessageResponse> {
        val message = ex.bindingResult.fieldErrors
            .joinToString("; ") { "${it.field}: ${it.defaultMessage}" }
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(MessageResponse(message))
    }

    @ExceptionHandler(DataIntegrityViolationException::class)
    fun handleDataIntegrity(ex: DataIntegrityViolationException): ResponseEntity<MessageResponse> {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(MessageResponse("Operation failed due to data conflict. Please try again."))
    }

    @ExceptionHandler(Exception::class)
    fun handleGeneral(ex: Exception): ResponseEntity<MessageResponse> {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(MessageResponse("Internal server error"))
    }
}
