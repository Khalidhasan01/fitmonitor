package com.fitmonitor.profile.mapper

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fitmonitor.profile.dto.*
import com.fitmonitor.profile.entity.UserProfileEntity

@PublishedApi internal val mapper = ObjectMapper()

fun UserProfileEntity.toResponse(): ProfileResponse {
    val goals = parseJson(goalsJson, object : TypeReference<GoalsData>() {})
    val notificationPrefs = parseJson(notificationPrefsJson, object : TypeReference<NotificationPrefsData>() {})
    val privacySettings = parseJson(privacySettingsJson, object : TypeReference<PrivacySettingsData>() {})
    val connectedDevices = parseJson(connectedDevicesJson, object : TypeReference<List<ConnectedDeviceData>>() {})
    val appearance = parseJson(appearanceJson, object : TypeReference<AppearanceData>() {})

    return ProfileResponse(
        name = user.name,
        age = age,
        height = height,
        weight = weight,
        goalWeight = goalWeight,
        dailyStepGoal = dailyStepGoal,
        dailyCalorieGoal = dailyCalorieGoal,
        waterGoal = waterGoal,
        sleepGoal = sleepGoal,
        avatarUrl = avatarUrl,
        unitSystem = unitSystem,
        activityLevel = activityLevel,
        timezone = timezone,
        bio = bio,
        goals = goals.toResponse(),
        notificationPrefs = notificationPrefs.toResponse(),
        privacySettings = privacySettings.toResponse(),
        connectedDevices = connectedDevices.map { it.toResponse() },
        appearance = appearance.toResponse()
    )
}

@PublishedApi internal inline fun <reified T> parseJson(json: String, typeRef: TypeReference<T>): T =
    mapper.readValue(json, typeRef)

// ── Internal JSON data classes ───────────────────────────────────

data class GoalsData(
    val macros: MacrosData = MacrosData(),
    val targetDate: String? = null,
    val targetWeight: Double = 0.0,
    val bodyFatPercent: Double? = null,
    val restingHR: Int? = null,
    val workoutsPerWeek: Int = 0,
    val history: List<GoalHistoryData> = emptyList()
)

data class MacrosData(
    val protein: Int = 0,
    val carbs: Int = 0,
    val fat: Int = 0
)

data class GoalHistoryData(
    val date: String = "",
    val type: String = "",
    val target: Double = 0.0,
    val achieved: Double = 0.0,
    val hit: Boolean = false
)

data class NotificationPrefsData(
    val emailNotifications: NotificationSettingData = NotificationSettingData(),
    val workoutReminders: NotificationSettingWithTimeData = NotificationSettingWithTimeData(),
    val mealReminders: NotificationSettingWithTimeData = NotificationSettingWithTimeData(),
    val weeklyReports: NotificationSettingData = NotificationSettingData(),
    val streakAtRisk: NotificationSettingData = NotificationSettingData(),
    val quietHours: QuietHoursData = QuietHoursData()
)

data class NotificationSettingData(
    val enabled: Boolean = false,
    val channels: List<String> = emptyList()
)

data class NotificationSettingWithTimeData(
    val enabled: Boolean = false,
    val channels: List<String> = emptyList(),
    val time: String = ""
)

data class QuietHoursData(
    val start: String = "",
    val end: String = "",
    val enabled: Boolean = false
)

data class PrivacySettingsData(
    val showOnLeaderboard: Boolean = true,
    val sharedMetrics: List<String> = emptyList(),
    val allowFriendRequests: Boolean = true,
    val blockedUsers: List<BlockedUserData> = emptyList(),
    val activeSessions: List<ActiveSessionData> = emptyList()
)

data class BlockedUserData(
    val id: String = "",
    val name: String = "",
    val blockedAt: String = ""
)

data class ActiveSessionData(
    val id: String = "",
    val device: String = "",
    val location: String? = null,
    val lastActive: String = "",
    val current: Boolean = false
)

data class ConnectedDeviceData(
    val id: String = "",
    val name: String = "",
    val type: String = "",
    val connected: Boolean = false,
    val lastSynced: String? = null,
    val syncFrequency: String = ""
)

data class AppearanceData(
    val theme: String = "smart",
    val accentColor: String = "green",
    val density: String = "comfortable",
    val widgetOrder: List<String> = emptyList()
)

// ── Extension functions: Data → DTO ──────────────────────────────

fun GoalsData.toResponse() = GoalsResponse(
    macros = macros.toResponse(),
    targetDate = targetDate,
    targetWeight = targetWeight,
    bodyFatPercent = bodyFatPercent,
    restingHR = restingHR,
    workoutsPerWeek = workoutsPerWeek,
    history = history.map { it.toResponse() }
)

fun MacrosData.toResponse() = MacrosResponse(
    protein = protein,
    carbs = carbs,
    fat = fat
)

fun GoalHistoryData.toResponse() = GoalHistoryEntryResponse(
    date = date,
    type = type,
    target = target,
    achieved = achieved,
    hit = hit
)

fun NotificationPrefsData.toResponse() = NotificationPrefsResponse(
    emailNotifications = emailNotifications.toResponse(),
    workoutReminders = workoutReminders.toResponse(),
    mealReminders = mealReminders.toResponse(),
    weeklyReports = weeklyReports.toResponse(),
    streakAtRisk = streakAtRisk.toResponse(),
    quietHours = quietHours.toResponse()
)

fun NotificationSettingData.toResponse() = NotificationSettingResponse(
    enabled = enabled,
    channels = channels
)

fun NotificationSettingWithTimeData.toResponse() = NotificationSettingWithTimeResponse(
    enabled = enabled,
    channels = channels,
    time = time
)

fun QuietHoursData.toResponse() = QuietHoursResponse(
    start = start,
    end = end,
    enabled = enabled
)

fun PrivacySettingsData.toResponse() = PrivacySettingsResponse(
    showOnLeaderboard = showOnLeaderboard,
    sharedMetrics = sharedMetrics,
    allowFriendRequests = allowFriendRequests,
    blockedUsers = blockedUsers.map { it.toResponse() },
    activeSessions = activeSessions.map { it.toResponse() }
)

fun BlockedUserData.toResponse() = BlockedUserResponse(
    id = id,
    name = name,
    blockedAt = blockedAt
)

fun ActiveSessionData.toResponse() = ActiveSessionResponse(
    id = id,
    device = device,
    location = location,
    lastActive = lastActive,
    current = current
)

fun ConnectedDeviceData.toResponse() = ConnectedDeviceResponse(
    id = id,
    name = name,
    type = type,
    connected = connected,
    lastSynced = lastSynced,
    syncFrequency = syncFrequency
)

fun AppearanceData.toResponse() = AppearanceResponse(
    theme = theme,
    accentColor = accentColor,
    density = density,
    widgetOrder = widgetOrder
)
