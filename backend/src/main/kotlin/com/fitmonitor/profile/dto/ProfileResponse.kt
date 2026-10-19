package com.fitmonitor.profile.dto

data class ProfileResponse(
    val name: String,
    val age: Int,
    val height: Double,
    val weight: Double,
    val goalWeight: Double?,
    val dailyStepGoal: Int,
    val dailyCalorieGoal: Int,
    val waterGoal: Int,
    val sleepGoal: Int,
    val avatarUrl: String?,
    val unitSystem: String,
    val activityLevel: String,
    val timezone: String,
    val bio: String,
    val goals: GoalsResponse,
    val notificationPrefs: NotificationPrefsResponse,
    val privacySettings: PrivacySettingsResponse,
    val connectedDevices: List<ConnectedDeviceResponse>,
    val appearance: AppearanceResponse
)
