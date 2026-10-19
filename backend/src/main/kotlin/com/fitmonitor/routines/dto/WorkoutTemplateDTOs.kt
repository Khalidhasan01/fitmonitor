package com.fitmonitor.routines.dto

data class CreateWorkoutTemplateRequest(
    val name: String,
    val exercises: List<TemplateExerciseRequest>
)

data class TemplateExerciseRequest(
    val exerciseDefinitionId: String,
    val name: String,
    val muscleGroup: String,
    val sets: List<TemplateSetRequest>
)

data class TemplateSetRequest(
    val reps: Int?,
    val weight: Double?,
    val duration: Int?
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
