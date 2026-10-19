package com.fitmonitor.profile.dto

data class ProfileStatsResponse(
    val bmi: Double,
    val weightToGoal: Double,
    val activityStreak: Int,
    val totalLoggedDays: Int,
    val workoutDays: Int
)
