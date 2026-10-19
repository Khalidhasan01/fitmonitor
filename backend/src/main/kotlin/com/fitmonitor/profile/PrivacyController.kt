package com.fitmonitor.profile

import com.fitmonitor.common.security.SecurityUtils
import com.fitmonitor.profile.dto.*
import com.fitmonitor.profile.service.PrivacyService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/profile")
class PrivacyController(
    private val privacyService: PrivacyService
) {
    @PatchMapping("/privacy")
    fun updatePrivacy(@RequestBody privacyMap: Map<String, Any>): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(privacyService.updatePrivacy(userId, privacyMap))
    }

    @GetMapping("/privacy/sessions")
    fun getSessions(): ResponseEntity<List<ActiveSessionResponse>> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(privacyService.getSessions(userId))
    }

    @DeleteMapping("/privacy/sessions/{sessionId}")
    fun removeSession(@PathVariable sessionId: String): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(privacyService.removeSession(userId, sessionId))
    }

    @GetMapping("/privacy/blocked-users")
    fun getBlockedUsers(): ResponseEntity<List<BlockedUserResponse>> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(privacyService.getBlockedUsers(userId))
    }

    @DeleteMapping("/privacy/blocked-users/{blockedUserId}")
    fun removeBlockedUser(@PathVariable blockedUserId: String): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(privacyService.removeBlockedUser(userId, blockedUserId))
    }
}
