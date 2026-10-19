package com.fitmonitor.profile

import com.fitmonitor.common.security.SecurityUtils
import com.fitmonitor.profile.dto.ProfileStatsResponse
import com.fitmonitor.profile.service.ProfileStatsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/profile")
class StatsController(
    private val profileStatsService: ProfileStatsService
) {
    @GetMapping("/stats")
    fun getStats(): ResponseEntity<ProfileStatsResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(profileStatsService.getProfileStats(userId))
    }
}
