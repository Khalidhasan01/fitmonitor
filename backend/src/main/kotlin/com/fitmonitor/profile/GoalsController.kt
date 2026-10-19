package com.fitmonitor.profile

import com.fitmonitor.common.security.SecurityUtils
import com.fitmonitor.profile.dto.GoalHistoryPageResponse
import com.fitmonitor.profile.dto.ProfileResponse
import com.fitmonitor.profile.service.GoalsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/profile")
class GoalsController(
    private val goalsService: GoalsService
) {
    @PatchMapping("/goals")
    fun updateGoals(@RequestBody goalsMap: Map<String, Any>): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(goalsService.updateGoals(userId, goalsMap))
    }

    @GetMapping("/goals/history")
    fun getGoalHistory(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<GoalHistoryPageResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(goalsService.getGoalHistory(userId, page, size))
    }
}
