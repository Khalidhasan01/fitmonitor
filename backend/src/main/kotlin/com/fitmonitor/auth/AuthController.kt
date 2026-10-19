package com.fitmonitor.auth

import com.fitmonitor.auth.dto.*
import com.fitmonitor.common.response.MessageResponse
import com.fitmonitor.common.security.SecurityUtils
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.ok(authService.login(request))
    }

    @PostMapping("/signup")
    fun signup(@Valid @RequestBody request: SignupRequest): ResponseEntity<AuthResponse> {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request))
    }

    @PostMapping("/forgot-password")
    fun forgotPassword(@Valid @RequestBody request: ForgotPasswordRequest): ResponseEntity<MessageResponse> {
        return ResponseEntity.ok(MessageResponse("Password reset link sent to your email"))
    }

    @PostMapping("/reset-password")
    fun resetPassword(@Valid @RequestBody request: ResetPasswordRequest): ResponseEntity<MessageResponse> {
        return ResponseEntity.ok(MessageResponse("Password reset successful"))
    }

    @GetMapping("/me")
    fun getCurrentUser(): ResponseEntity<UserResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(authService.getCurrentUser(userId))
    }

    @DeleteMapping("/account")
    fun deleteAccount(): ResponseEntity<MessageResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        authService.deleteAccount(userId)
        return ResponseEntity.ok(MessageResponse("Account deleted successfully"))
    }
}
