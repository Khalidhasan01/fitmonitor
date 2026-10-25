package com.fitmonitor.routines.dto

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.PositiveOrZero
import jakarta.validation.constraints.Size

data class CreateWorkoutTemplateRequest(
    @field:NotBlank @field:Size(max = 100)
    val name: String,
    @field:NotEmpty @field:Valid
    val exercises: List<TemplateExerciseRequest>
)

data class TemplateExerciseRequest(
    @field:NotBlank
    val exerciseDefinitionId: String,
    @field:NotBlank
    val name: String,
    @field:NotBlank
    val muscleGroup: String,
    @field:NotEmpty @field:Valid
    val sets: List<TemplateSetRequest>
)

data class TemplateSetRequest(
    @field:PositiveOrZero val reps: Int?,
    @field:PositiveOrZero val weight: Double?,
    @field:PositiveOrZero val duration: Int?
)

data class WorkoutTemplateResponse(
    val id: String,
    val name: String,
    val exercises: List<TemplateExerciseResponse>,
    val createdAt: String,
    val updatedAt: String
)

data class TemplateExerciseResponse(
    val exerciseDefinitionId: String,
    val name: String,
    val muscleGroup: String,
    val sets: List<TemplateSetResponse>
)

data class TemplateSetResponse(
    val reps: Int?,
    val weight: Double?,
    val duration: Int?
)
