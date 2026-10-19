package com.fitmonitor.profile.dto

data class PrivacySettingsResponse(
    val showOnLeaderboard: Boolean,
    val sharedMetrics: List<String>,
    val allowFriendRequests: Boolean,
    val blockedUsers: List<BlockedUserResponse>,
    val activeSessions: List<ActiveSessionResponse>
)

data class BlockedUserResponse(
    val id: String,
    val name: String,
    val blockedAt: String
)

data class ActiveSessionResponse(
    val id: String,
    val device: String,
    val location: String?,
    val lastActive: String,
    val current: Boolean
)
