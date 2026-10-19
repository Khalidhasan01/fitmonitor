package com.fitmonitor.profile.dto

data class AppearanceResponse(
    val theme: String,
    val accentColor: String,
    val density: String,
    val widgetOrder: List<String>
)
