package com.fitmonitor.routines.mapper

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fitmonitor.routines.dto.*
import com.fitmonitor.routines.entity.WorkoutTemplateEntity
import java.time.Instant

private val mapper = jacksonObjectMapper()

data class ExerciseJson(
    val exerciseDefinitionId: String,
    val name: String,
    val muscleGroup: String,
    val sets: List<SetJson>
)

data class SetJson(
    val reps: Int?,
    val weight: Double?,
    val duration: Int?
)

fun WorkoutTemplateEntity.toResponse(): WorkoutTemplateResponse {
    val exercises: List<ExerciseJson> = try {
        mapper.readValue(exercisesJson)
    } catch (_: Exception) {
        emptyList()
    }

    return WorkoutTemplateResponse(
        id = id,
        name = name,
        exercises = exercises.map { ex ->
            TemplateExerciseResponse(
                exerciseDefinitionId = ex.exerciseDefinitionId,
                name = ex.name,
                muscleGroup = ex.muscleGroup,
                sets = ex.sets.map { set ->
                    TemplateSetResponse(
                        reps = set.reps,
                        weight = set.weight,
                        duration = set.duration
                    )
                }
            )
        },
        createdAt = createdAt.toString(),
        updatedAt = updatedAt.toString()
    )
}

fun toJson(exercises: List<TemplateExerciseRequest>): String {
    val jsonList = exercises.map { ex ->
        ExerciseJson(
            exerciseDefinitionId = ex.exerciseDefinitionId,
            name = ex.name,
            muscleGroup = ex.muscleGroup,
            sets = ex.sets.map { set ->
                SetJson(
                    reps = set.reps,
                    weight = set.weight,
                    duration = set.duration
                )
            }
        )
    }
    return mapper.writeValueAsString(jsonList)
}

fun CreateWorkoutTemplateRequest.toEntity(userId: String): WorkoutTemplateEntity {
    val exercises = this.exercises.map { ex ->
        ExerciseJson(
            exerciseDefinitionId = ex.exerciseDefinitionId,
            name = ex.name,
            muscleGroup = ex.muscleGroup,
            sets = ex.sets.map { set ->
                SetJson(
                    reps = set.reps,
                    weight = set.weight,
                    duration = set.duration
                )
            }
        )
    }

    return WorkoutTemplateEntity(
        userId = userId,
        name = name,
        exercisesJson = mapper.writeValueAsString(exercises),
        createdAt = Instant.now(),
        updatedAt = Instant.now()
    )
}
