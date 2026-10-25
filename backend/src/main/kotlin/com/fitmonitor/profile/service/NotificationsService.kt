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
class NotificationsService(
    private val userProfileRepository: UserProfileRepository
) {
    private val mapper = ObjectMapper()

    @Transactional
    fun updateNotifications(userId: String, prefsMap: Map<String, Any>): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        profile.notificationPrefsJson = mapper.writeValueAsString(prefsMap)
        userProfileRepository.flush()
        return profile.toResponse()
    }
}
