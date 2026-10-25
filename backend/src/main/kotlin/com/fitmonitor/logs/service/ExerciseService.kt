package com.fitmonitor.logs.service

import com.fitmonitor.common.exception.ValidationException
import com.fitmonitor.logs.dto.CreateExerciseDefinitionRequest
import com.fitmonitor.logs.dto.ExerciseDefinitionResponse
import com.fitmonitor.logs.entity.ExerciseDefinitionEntity
import com.fitmonitor.logs.mapper.toResponse
import com.fitmonitor.logs.repository.ExerciseDefinitionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class ExerciseService(
    private val repository: ExerciseDefinitionRepository
) {
    fun getExercises(userId: String, muscleGroup: String?, query: String?): List<ExerciseDefinitionResponse> =
        repository.findVisibleTo(userId)
            .filter { muscleGroup.isNullOrBlank() || it.muscleGroup.equals(muscleGroup, ignoreCase = true) }
            .filter { query.isNullOrBlank() || it.name.contains(query.trim(), ignoreCase = true) }
            .map { it.toResponse() }

    @Transactional
    fun createExercise(userId: String, request: CreateExerciseDefinitionRequest): ExerciseDefinitionResponse {
        val name = request.name.trim()
        if (repository.findVisibleTo(userId).any { it.name.equals(name, ignoreCase = true) }) {
            throw ValidationException("An exercise named '$name' already exists")
        }
        val saved = repository.save(
            ExerciseDefinitionEntity(
                name = name,
                muscleGroup = request.muscleGroup.trim(),
                isCustom = true,
                ownerId = userId
            )
        )
        return saved.toResponse()
    }
}
