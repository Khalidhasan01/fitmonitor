package com.fitmonitor.auth

import com.fitmonitor.common.exception.ResourceNotFoundException
import com.fitmonitor.common.exception.UnauthorizedException
import com.fitmonitor.common.exception.ConflictException
import com.fitmonitor.auth.dto.*
import com.fitmonitor.auth.entity.UserEntity
import com.fitmonitor.auth.mapper.toUserResponse
import com.fitmonitor.auth.repository.UserRepository
import com.fitmonitor.common.security.JwtTokenProvider
import com.fitmonitor.profile.entity.UserProfileEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider
) {

    @Transactional
    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email.normalizedEmail())
            ?: throw UnauthorizedException("Invalid email or password")

        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw UnauthorizedException("Invalid email or password")
        }

        val token = jwtTokenProvider.generateToken(user.id)
        return AuthResponse(
            user = user.toUserResponse(),
            token = token
        )
    }

    @Transactional
    fun signup(request: SignupRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email.normalizedEmail())) {
            throw ConflictException("An account with this email already exists")
        }

        val user = UserEntity(
            name = request.name.trim(),
            email = request.email.normalizedEmail(),
            passwordHash = passwordEncoder.encode(request.password)
        )
        user.profile = UserProfileEntity(user = user)

        val saved = userRepository.save(user)
        val token = jwtTokenProvider.generateToken(saved.id)

        return AuthResponse(
            user = saved.toUserResponse(),
            token = token
        )
    }

    fun getCurrentUser(userId: String): UserResponse {
        val user = userRepository.findById(userId)
            .orElse(null) ?: throw ResourceNotFoundException("User not found")
        return user.toUserResponse()
    }

    @Transactional
    fun deleteAccount(userId: String) {
        if (!userRepository.existsById(userId)) {
            throw ResourceNotFoundException("User not found")
        }
        userRepository.deleteById(userId)
    }
}

private fun String.normalizedEmail() = trim().lowercase()
