package com.fitmonitor.profile.service

import com.fitmonitor.common.exception.ResourceNotFoundException
import com.fasterxml.jackson.databind.ObjectMapper
import com.fitmonitor.profile.dto.ProfileResponse
import com.fitmonitor.profile.mapper.toResponse
import com.fitmonitor.profile.repository.UserProfileRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class AppearanceService(
    private val userProfileRepository: UserProfileRepository
) {
    private val mapper = ObjectMapper()

    @Transactional
    fun updateAppearance(userId: String, appearanceMap: Map<String, Any>): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        profile.appearanceJson = mapper.writeValueAsString(appearanceMap)
        userProfileRepository.flush()
        return profile.toResponse()
    }
}
