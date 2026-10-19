package com.fitmonitor.profile.dto

data class ConnectedDeviceResponse(
    val id: String,
    val name: String,
    val type: String,
    val connected: Boolean,
    val lastSynced: String?,
    val syncFrequency: String
)

data class SyncFrequencyRequest(
    val syncFrequency: String
)
