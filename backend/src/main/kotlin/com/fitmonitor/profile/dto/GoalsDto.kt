package com.fitmonitor.profile.dto

data class GoalsResponse(
    val macros: MacrosResponse,
    val targetDate: String?,
    val targetWeight: Double,
    val bodyFatPercent: Double?,
    val restingHR: Int?,
    val workoutsPerWeek: Int,
    val history: List<GoalHistoryEntryResponse>
)

data class MacrosResponse(
    val protein: Int,
    val carbs: Int,
    val fat: Int
)

data class GoalHistoryEntryResponse(
    val date: String,
    val type: String,
    val target: Double,
    val achieved: Double,
    val hit: Boolean
)

data class GoalHistoryPageResponse(
    val entries: List<GoalHistoryEntryResponse>,
    val page: Int,
    val size: Int,
    val total: Int
)
