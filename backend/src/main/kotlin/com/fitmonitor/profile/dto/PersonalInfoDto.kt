package com.fitmonitor.profile.dto

import jakarta.validation.constraints.DecimalMax
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class PersonalInfoRequest(
    @field:Size(min = 1, max = 100)
    val name: String? = null,
    @field:Min(1) @field:Max(120)
    val age: Int? = null,
    @field:DecimalMin("30.0") @field:DecimalMax("300.0")
    val height: Double? = null,
    @field:DecimalMin("20.0") @field:DecimalMax("500.0")
    val weight: Double? = null,
    @field:DecimalMin("20.0") @field:DecimalMax("500.0")
    val goalWeight: Double? = null,
    @field:Pattern(regexp = "metric|imperial", message = "must be 'metric' or 'imperial'")
    val unitSystem: String? = null,
    val activityLevel: String? = null,
    @field:Size(max = 64)
    val timezone: String? = null,
    @field:Size(max = 500)
    val bio: String? = null
)

data class AvatarResponse(
    val avatarUrl: String
)
