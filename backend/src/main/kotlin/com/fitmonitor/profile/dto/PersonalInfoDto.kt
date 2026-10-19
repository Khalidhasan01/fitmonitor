package com.fitmonitor.profile.dto

data class PersonalInfoRequest(
    val name: String? = null,
    val age: Int? = null,
    val height: Double? = null,
    val weight: Double? = null,
    val goalWeight: Double? = null,
    val unitSystem: String? = null,
    val activityLevel: String? = null,
    val timezone: String? = null,
    val bio: String? = null
)

data class AvatarResponse(
    val avatarUrl: String
)
