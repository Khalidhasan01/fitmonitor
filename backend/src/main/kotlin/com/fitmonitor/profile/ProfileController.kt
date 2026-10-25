package com.fitmonitor.profile

import com.fitmonitor.common.response.MessageResponse
import com.fitmonitor.common.security.SecurityUtils
import com.fitmonitor.profile.dto.*
import com.fitmonitor.profile.service.ProfileService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/profile")
class ProfileController(
    private val profileService: ProfileService
) {
    @GetMapping
    fun getProfile(): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(profileService.getProfile(userId))
    }

    @PutMapping
    fun updateProfile(@RequestBody updates: Map<String, Any>): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(profileService.updateProfile(userId, updates))
    }

    @PatchMapping("/personal")
    fun updatePersonal(@Valid @RequestBody request: PersonalInfoRequest): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(profileService.updatePersonal(userId, request))
    }

    @PostMapping("/avatar")
    fun uploadAvatar(@RequestParam file: MultipartFile): ResponseEntity<AvatarResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(profileService.uploadAvatar(userId, file.inputStream, file.originalFilename ?: "avatar.png"))
    }

    @DeleteMapping("/avatar")
    fun deleteAvatar(): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(profileService.deleteAvatar(userId))
    }

    @DeleteMapping
    fun deleteProfile(): ResponseEntity<MessageResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        profileService.deleteProfile(userId)
        return ResponseEntity.ok(MessageResponse("Account deleted successfully"))
    }
}
