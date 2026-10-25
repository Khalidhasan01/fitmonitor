package com.fitmonitor.common.exception

import com.fitmonitor.common.response.MessageResponse
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import org.springframework.web.multipart.MaxUploadSizeExceededException
import org.springframework.web.multipart.support.MissingServletRequestPartException

@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleNotFound(ex: ResourceNotFoundException) = respond(HttpStatus.NOT_FOUND, ex.message ?: "Resource not found")

    @ExceptionHandler(ValidationException::class, IllegalArgumentException::class)
    fun handleBadRequest(ex: RuntimeException) = respond(HttpStatus.BAD_REQUEST, ex.message ?: "Bad request")

    @ExceptionHandler(UnauthorizedException::class)
    fun handleUnauthorized(ex: UnauthorizedException) = respond(HttpStatus.UNAUTHORIZED, ex.message ?: "Unauthorized")

    @ExceptionHandler(ConflictException::class)
    fun handleConflict(ex: ConflictException) = respond(HttpStatus.CONFLICT, ex.message ?: "Conflict")

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException) = respond(
        HttpStatus.BAD_REQUEST,
        ex.bindingResult.fieldErrors.joinToString("; ") { "${it.field}: ${it.defaultMessage}" }
    )

    @ExceptionHandler(
        HttpMessageNotReadableException::class,
        MethodArgumentTypeMismatchException::class,
        MissingServletRequestParameterException::class,
        MissingServletRequestPartException::class
    )
    fun handleMalformedRequest(ex: Exception) = respond(HttpStatus.BAD_REQUEST, "Malformed or missing request data")

    @ExceptionHandler(MaxUploadSizeExceededException::class)
    fun handleUploadTooLarge(ex: MaxUploadSizeExceededException) =
        respond(HttpStatus.PAYLOAD_TOO_LARGE, "Uploaded file is too large")

    @ExceptionHandler(DataIntegrityViolationException::class)
    fun handleDataIntegrity(ex: DataIntegrityViolationException): ResponseEntity<MessageResponse> {
        log.warn("Data integrity violation", ex)
        return respond(HttpStatus.CONFLICT, "Operation failed due to data conflict. Please try again.")
    }

    @ExceptionHandler(Exception::class)
    fun handleGeneral(ex: Exception): ResponseEntity<MessageResponse> {
        log.error("Unhandled exception", ex)
        return respond(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error")
    }

    private fun respond(status: HttpStatus, message: String): ResponseEntity<MessageResponse> =
        ResponseEntity.status(status).body(MessageResponse(message))
}
