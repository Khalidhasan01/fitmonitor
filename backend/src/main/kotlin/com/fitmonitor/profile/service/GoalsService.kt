package com.fitmonitor.profile.service

import com.fitmonitor.common.exception.ResourceNotFoundException
import com.fasterxml.jackson.core.type.TypeReference
import com.fitmonitor.profile.dto.GoalHistoryPageResponse
import com.fitmonitor.profile.dto.ProfileResponse
import com.fitmonitor.profile.mapper.GoalsData
import com.fitmonitor.profile.mapper.parseJson
import com.fitmonitor.profile.mapper.toResponse
import com.fitmonitor.profile.repository.UserProfileRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class GoalsService(
    private val userProfileRepository: UserProfileRepository
) {
    @Transactional
    fun updateGoals(userId: String, goalsMap: Map<String, Any>): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        profile.goalsJson = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(goalsMap)
        userProfileRepository.flush()
        return profile.toResponse()
    }

    fun getGoalHistory(userId: String, page: Int, size: Int): GoalHistoryPageResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        val goals = parseJson(profile.goalsJson, object : TypeReference<GoalsData>() {})
        val allHistory = goals.history
        val total = allHistory.size
        val fromIndex = page * size
        val entries = allHistory
            .drop(fromIndex)
            .take(size)
            .map { it.toResponse() }
        return GoalHistoryPageResponse(
            entries = entries,
            page = page,
            size = size,
            total = total
        )
    }
}
