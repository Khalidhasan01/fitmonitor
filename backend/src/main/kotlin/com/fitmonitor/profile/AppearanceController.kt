package com.fitmonitor.profile

import com.fitmonitor.common.security.SecurityUtils
import com.fitmonitor.profile.dto.ProfileResponse
import com.fitmonitor.profile.service.AppearanceService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/profile")
class AppearanceController(
    private val appearanceService: AppearanceService
) {
    @PatchMapping("/appearance")
    fun updateAppearance(@RequestBody appearanceMap: Map<String, Any>): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(appearanceService.updateAppearance(userId, appearanceMap))
    }
}
