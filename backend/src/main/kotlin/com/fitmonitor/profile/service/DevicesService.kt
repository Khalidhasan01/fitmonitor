package com.fitmonitor.profile.service

import com.fitmonitor.common.exception.ResourceNotFoundException
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fitmonitor.profile.dto.*
import com.fitmonitor.profile.mapper.*
import com.fitmonitor.profile.repository.UserProfileRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional(readOnly = true)
class DevicesService(
    private val userProfileRepository: UserProfileRepository
) {
    private val mapper = ObjectMapper()

    @Transactional
    fun updateDevices(userId: String, devicesList: List<Map<String, Any>>): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        profile.connectedDevicesJson = mapper.writeValueAsString(devicesList)
        userProfileRepository.flush()
        return profile.toResponse()
    }

    @Transactional
    fun connectDevice(userId: String, deviceId: String): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        profile.connectedDevicesJson = updateDeviceInJson(profile.connectedDevicesJson, deviceId) {
            it.copy(connected = true)
        }
        userProfileRepository.flush()
        return profile.toResponse()
    }

    @Transactional
    fun disconnectDevice(userId: String, deviceId: String): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        profile.connectedDevicesJson = updateDeviceInJson(profile.connectedDevicesJson, deviceId) {
            it.copy(connected = false)
        }
        userProfileRepository.flush()
        return profile.toResponse()
    }

    @Transactional
    fun syncDevice(userId: String, deviceId: String): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        val now = LocalDateTime.now().toString()
        profile.connectedDevicesJson = updateDeviceInJson(profile.connectedDevicesJson, deviceId) {
            it.copy(lastSynced = now)
        }
        userProfileRepository.flush()
        return profile.toResponse()
    }

    @Transactional
    fun updateDeviceSyncFrequency(userId: String, deviceId: String, frequency: String): ProfileResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        profile.connectedDevicesJson = updateDeviceInJson(profile.connectedDevicesJson, deviceId) {
            it.copy(syncFrequency = frequency)
        }
        userProfileRepository.flush()
        return profile.toResponse()
    }

    fun getDevices(userId: String): List<ConnectedDeviceResponse> {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        val devices = parseJson(profile.connectedDevicesJson, object : TypeReference<List<ConnectedDeviceData>>() {})
        return devices.map { it.toResponse() }
    }

    private fun updateDeviceInJson(json: String, deviceId: String, transform: (ConnectedDeviceData) -> ConnectedDeviceData): String {
        val devices = parseJson(json, object : TypeReference<List<ConnectedDeviceData>>() {}).toMutableList()
        val updated = devices.map { if (it.id == deviceId) transform(it) else it }
        return mapper.writeValueAsString(updated)
    }
}
