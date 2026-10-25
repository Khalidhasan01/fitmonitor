package com.fitmonitor.logs.dto

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.PositiveOrZero

data class MealResponse(
    val id: String,
    val name: String,
    val type: String,
    val calories: Int,
    val protein: Int,
    val carbs: Int,
    val fat: Int
)

data class ExerciseSetResponse(
    val set: Int,
    val reps: Int?,
    val weight: Double?,
    val duration: Int?
)

data class ExerciseResponse(
    val id: String,
    val exerciseDefinitionId: String?,
    val name: String,
    val muscleGroup: String,
    val sets: List<ExerciseSetResponse>
)

data class WorkoutResponse(
    val id: String,
    val date: String,
    val exercises: List<ExerciseResponse>
)

data class DailyLogResponse(
    val date: String,
    val steps: Int,
    val caloriesBurned: Int,
    val caloriesConsumed: Int,
    val heartRateAvg: Int,
    val sleepHours: Double,
    val waterCups: Int,
    val weight: Double,
    val meals: List<MealResponse>,
    val workouts: List<WorkoutResponse>
)

data class ExerciseDefinitionResponse(
    val id: String,
    val name: String,
    val muscleGroup: String
)

data class CreateExerciseDefinitionRequest(
    @field:NotBlank val name: String,
    @field:NotBlank val muscleGroup: String
)

data class CreateSetRequest(
    @field:PositiveOrZero val reps: Int?,
    @field:PositiveOrZero val weight: Double?,
    @field:PositiveOrZero val duration: Int?
)

data class CreateExerciseRequest(
    @field:NotBlank val exerciseDefinitionId: String,
    @field:NotEmpty @field:Valid val sets: List<CreateSetRequest>
)

data class CreateWorkoutRequest(
    @field:NotBlank val date: String,
    @field:NotEmpty @field:Valid val exercises: List<CreateExerciseRequest>
)
