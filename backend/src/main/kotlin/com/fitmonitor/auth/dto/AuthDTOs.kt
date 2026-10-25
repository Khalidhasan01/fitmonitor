package com.fitmonitor.auth.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class LoginRequest(
    @field:NotBlank @field:Email
    val email: String,

    @field:NotBlank @field:Size(min = 6, max = 128)
    val password: String
)

data class SignupRequest(
    @field:NotBlank @field:Size(max = 100)
    val name: String,

    @field:NotBlank @field:Email
    val email: String,

    @field:NotBlank @field:Size(min = 6, max = 128)
    val password: String
)

data class ForgotPasswordRequest(
    @field:NotBlank @field:Email
    val email: String
)

data class ResetPasswordRequest(
    @field:NotBlank
    val token: String,

    @field:NotBlank @field:Size(min = 6, max = 128)
    val password: String
)

data class UserResponse(
    val id: String,
    val name: String,
    val email: String
)

data class AuthResponse(
    val user: UserResponse,
    val token: String
)
