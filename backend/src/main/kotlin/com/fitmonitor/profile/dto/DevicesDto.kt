package com.fitmonitor.profile.dto

import jakarta.validation.constraints.NotBlank

data class ConnectedDeviceResponse(
    val id: String,
    val name: String,
    val type: String,
    val connected: Boolean,
    val lastSynced: String?,
    val syncFrequency: String
)

data class SyncFrequencyRequest(
    @field:NotBlank
    val syncFrequency: String
)
