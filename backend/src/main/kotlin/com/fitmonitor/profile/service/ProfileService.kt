package com.fitmonitor.profile.service

import com.fitmonitor.common.exception.ResourceNotFoundException
import com.fitmonitor.common.exception.ValidationException
import com.fasterxml.jackson.databind.ObjectMapper
import com.fitmonitor.auth.repository.UserRepository
import com.fitmonitor.profile.dto.*
import com.fitmonitor.profile.entity.UserProfileEntity
import com.fitmonitor.profile.mapper.toResponse
import com.fitmonitor.profile.repository.UserProfileRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.InputStream
import java.util.*

@Service
@Transactional(readOnly = true)
class ProfileService(
    private val userProfileRepository: UserProfileRepository,
    private val userRepository: UserRepository
) {
    private val mapper = ObjectMapper()

    fun getProfile(userId: String): ProfileResponse {
        val profile = getUserProfileEntity(userId)
        return profile.toResponse()
    }

    @Transactional
    fun updateProfile(userId: String, updates: Map<String, Any>): ProfileResponse {
        val profile = getUserProfileEntity(userId)

        try {
            updates.forEach { (key, value) ->
                when (key) {
                    "age" -> profile.age = (value as Number).toInt()
                    "height" -> profile.height = (value as Number).toDouble()
                    "weight" -> profile.weight = (value as Number).toDouble()
                    "goalWeight" -> profile.goalWeight = (value as Number?)?.toDouble()
                    "dailyStepGoal" -> profile.dailyStepGoal = (value as Number).toInt()
                    "dailyCalorieGoal" -> profile.dailyCalorieGoal = (value as Number).toInt()
                    "waterGoal" -> profile.waterGoal = (value as Number).toInt()
                    "sleepGoal" -> profile.sleepGoal = (value as Number).toInt()
                    "avatarUrl" -> profile.avatarUrl = value as? String
                    "unitSystem" -> profile.unitSystem = value as String
                    "activityLevel" -> profile.activityLevel = value as String
                    "timezone" -> profile.timezone = value as String
                    "bio" -> profile.bio = value as String
                    "goals" -> profile.goalsJson = mapper.writeValueAsString(value)
                    "notificationPrefs" -> profile.notificationPrefsJson = mapper.writeValueAsString(value)
                    "privacySettings" -> profile.privacySettingsJson = mapper.writeValueAsString(value)
                    "connectedDevices" -> profile.connectedDevicesJson = mapper.writeValueAsString(value)
                    "appearance" -> profile.appearanceJson = mapper.writeValueAsString(value)
                    "name" -> {
                        userRepository.findById(userId).ifPresent { user ->
                            user.name = value as String
                            userRepository.save(user)
                        }
                    }
                }
            }

        } catch (_: ClassCastException) {
            throw ValidationException("One or more profile fields have an invalid type")
        } catch (_: NullPointerException) {
            throw ValidationException("Profile fields must not be null")
        }

        userProfileRepository.flush()
        return profile.toResponse()
    }

    @Transactional
    fun updatePersonal(userId: String, request: PersonalInfoRequest): ProfileResponse {
        val profile = getUserProfileEntity(userId)

        request.name?.let { name ->
            userRepository.findById(userId).ifPresent { user ->
                user.name = name
                userRepository.save(user)
            }
        }
        request.age?.let { profile.age = it }
        request.height?.let { profile.height = it }
        request.weight?.let { profile.weight = it }
        request.goalWeight?.let { profile.goalWeight = it }
        request.unitSystem?.let { profile.unitSystem = it }
        request.activityLevel?.let { profile.activityLevel = it }
        request.timezone?.let { profile.timezone = it }
        request.bio?.let { profile.bio = it }

        userProfileRepository.flush()
        return profile.toResponse()
    }

    @Transactional
    fun uploadAvatar(userId: String, fileContent: InputStream, originalFilename: String): AvatarResponse {
        val profile = getUserProfileEntity(userId)
        val contentType = when (originalFilename.substringAfterLast('.', "").lowercase()) {
            "jpg", "jpeg" -> "image/jpeg"
            "png" -> "image/png"
            "gif" -> "image/gif"
            "webp" -> "image/webp"
            else -> throw ValidationException("Avatar must be a jpg, png, gif or webp image")
        }
        val bytes = fileContent.readBytes()
        if (bytes.isEmpty()) throw ValidationException("Avatar file is empty")
        val base64 = Base64.getEncoder().encodeToString(bytes)
        val dataUrl = "data:$contentType;base64,$base64"
        profile.avatarUrl = dataUrl
        userProfileRepository.flush()
        return AvatarResponse(avatarUrl = dataUrl)
    }

    @Transactional
    fun deleteAvatar(userId: String): ProfileResponse {
        val profile = getUserProfileEntity(userId)
        profile.avatarUrl = null
        userProfileRepository.flush()
        return profile.toResponse()
    }

    @Transactional
    fun deleteProfile(userId: String) {
        if (!userRepository.existsById(userId)) {
            throw ResourceNotFoundException("User not found")
        }
        userRepository.deleteById(userId)
    }

    private fun getUserProfileEntity(userId: String): UserProfileEntity {
        return userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
    }
}
