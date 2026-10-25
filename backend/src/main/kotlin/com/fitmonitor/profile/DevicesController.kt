package com.fitmonitor.profile

import com.fitmonitor.common.security.SecurityUtils
import com.fitmonitor.profile.dto.*
import com.fitmonitor.profile.service.DevicesService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/profile")
class DevicesController(
    private val devicesService: DevicesService
) {
    @PatchMapping("/devices")
    fun updateDevices(@RequestBody devicesList: List<Map<String, Any>>): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(devicesService.updateDevices(userId, devicesList))
    }

    @GetMapping("/devices")
    fun getDevices(): ResponseEntity<List<ConnectedDeviceResponse>> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(devicesService.getDevices(userId))
    }

    @PatchMapping("/devices/{deviceId}/connect")
    fun connectDevice(@PathVariable deviceId: String): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(devicesService.connectDevice(userId, deviceId))
    }

    @PatchMapping("/devices/{deviceId}/disconnect")
    fun disconnectDevice(@PathVariable deviceId: String): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(devicesService.disconnectDevice(userId, deviceId))
    }

    @PostMapping("/devices/{deviceId}/sync")
    fun syncDevice(@PathVariable deviceId: String): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(devicesService.syncDevice(userId, deviceId))
    }

    @PatchMapping("/devices/{deviceId}/sync-frequency")
    fun updateDeviceSyncFrequency(
        @PathVariable deviceId: String,
        @Valid @RequestBody request: SyncFrequencyRequest
    ): ResponseEntity<ProfileResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(devicesService.updateDeviceSyncFrequency(userId, deviceId, request.syncFrequency))
    }
}
