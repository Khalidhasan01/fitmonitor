package com.fitmonitor.profile.dto

data class NotificationPrefsResponse(
    val emailNotifications: NotificationSettingResponse,
    val workoutReminders: NotificationSettingWithTimeResponse,
    val mealReminders: NotificationSettingWithTimeResponse,
    val weeklyReports: NotificationSettingResponse,
    val streakAtRisk: NotificationSettingResponse,
    val quietHours: QuietHoursResponse
)

data class NotificationSettingResponse(
    val enabled: Boolean,
    val channels: List<String>
)

data class NotificationSettingWithTimeResponse(
    val enabled: Boolean,
    val channels: List<String>,
    val time: String
)

data class QuietHoursResponse(
    val start: String,
    val end: String,
    val enabled: Boolean
)
