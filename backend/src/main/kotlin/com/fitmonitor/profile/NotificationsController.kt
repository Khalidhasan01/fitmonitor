package com.fitmonitor.profile

import com.fitmonitor.common.security.SecurityUtils
import com.fitmonitor.profile.dto.ProfileResponse
import com.fitmonitor.profile.service.NotificationsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/profile")
class NotificationsController(
    private val notificationsService: NotificationsService
) {
    @PatchMapping("/notifications")
    fun updateNotifications(@RequestBody prefsMap: Map<String, Any>): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(notificationsService.updateNotifications(userId, prefsMap))
    }
}
