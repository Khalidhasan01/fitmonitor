package com.fitmonitor.logs.mapper

import com.fitmonitor.logs.dto.*
import com.fitmonitor.logs.entity.*

fun MealEntity.toResponse() = MealResponse(requireNotNull(id), name, type, calories, protein, carbs, fat)

fun ExerciseEntity.toResponse() = ExerciseResponse(
    id = requireNotNull(id),
    exerciseDefinitionId = exerciseDefinition?.id,
    name = name,
    muscleGroup = muscleGroup,
    sets = sets.sortedBy { it.setNumber }
        .map { ExerciseSetResponse(it.setNumber, it.reps, it.weight, it.duration) }
)

fun WorkoutEntity.toResponse() = WorkoutResponse(
    id = requireNotNull(id),
    date = date.toString(),
    exercises = exercises.map { it.toResponse() }
)

fun DailyLogEntity.toResponse() = DailyLogResponse(
    date = date.toString(),
    steps = steps,
    caloriesBurned = caloriesBurned,
    caloriesConsumed = caloriesConsumed,
    heartRateAvg = heartRateAvg,
    sleepHours = sleepHours,
    waterCups = waterCups,
    weight = weight,
    meals = meals.map { it.toResponse() },
    workouts = workouts.map { it.toResponse() }
)

fun ExerciseDefinitionEntity.toResponse() = ExerciseDefinitionResponse(requireNotNull(id), name, muscleGroup)
