package com.fitmonitor.profile.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fitmonitor.profile.dto.*
import com.fitmonitor.profile.mapper.*
import com.fitmonitor.profile.repository.UserProfileRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class PrivacyService(
    private val userProfileRepository: UserProfileRepository
) {
    private val mapper = ObjectMapper()

    @Transactional
    fun updatePrivacy(userId: String, privacyMap: Map<String, Any>): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw IllegalArgumentException("Profile not found")
        profile.privacySettingsJson = mapper.writeValueAsString(privacyMap)
        userProfileRepository.flush()
        return profile.toResponse()
    }

    @Transactional
    fun removeSession(userId: String, sessionId: String): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw IllegalArgumentException("Profile not found")
        val privacy = parseJson(profile.privacySettingsJson, object : TypeReference<PrivacySettingsData>() {})
        val updated = privacy.copy(activeSessions = privacy.activeSessions.filter { it.id != sessionId })
        profile.privacySettingsJson = mapper.writeValueAsString(updated)
        userProfileRepository.flush()
        return profile.toResponse()
    }

    @Transactional
    fun removeBlockedUser(userId: String, blockedUserId: String): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw IllegalArgumentException("Profile not found")
        val privacy = parseJson(profile.privacySettingsJson, object : TypeReference<PrivacySettingsData>() {})
        val updated = privacy.copy(blockedUsers = privacy.blockedUsers.filter { it.id != blockedUserId })
        profile.privacySettingsJson = mapper.writeValueAsString(updated)
        userProfileRepository.flush()
        return profile.toResponse()
    }

    fun getSessions(userId: String): List<ActiveSessionResponse> {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw IllegalArgumentException("Profile not found")
        val privacy = parseJson(profile.privacySettingsJson, object : TypeReference<PrivacySettingsData>() {})
        return privacy.activeSessions.map { it.toResponse() }
    }

    fun getBlockedUsers(userId: String): List<BlockedUserResponse> {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw IllegalArgumentException("Profile not found")
        val privacy = parseJson(profile.privacySettingsJson, object : TypeReference<PrivacySettingsData>() {})
        return privacy.blockedUsers.map { it.toResponse() }
    }
}
