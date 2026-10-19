package com.fitmonitor.routines.service

import com.fitmonitor.routines.dto.*
import com.fitmonitor.routines.entity.WorkoutTemplateEntity
import com.fitmonitor.routines.mapper.toEntity
import com.fitmonitor.routines.mapper.toJson
import com.fitmonitor.routines.mapper.toResponse
import com.fitmonitor.routines.repository.WorkoutTemplateRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
@Transactional(readOnly = true)
class WorkoutTemplateService(
    private val repository: WorkoutTemplateRepository
) {
    fun getTemplates(userId: String): List<WorkoutTemplateResponse> {
        return repository.findByUserIdOrderByUpdatedAtDesc(userId)
            .map { it.toResponse() }
    }

    fun getTemplateById(userId: String, templateId: String): WorkoutTemplateResponse {
        val template = repository.findByIdAndUserId(templateId, userId)
            ?: throw IllegalArgumentException("Template not found")
        return template.toResponse()
    }

    @Transactional
    fun createTemplate(userId: String, request: CreateWorkoutTemplateRequest): WorkoutTemplateResponse {
        val template = request.toEntity(userId)
        return repository.save(template).toResponse()
    }

    @Transactional
    fun updateTemplate(userId: String, templateId: String, request: CreateWorkoutTemplateRequest): WorkoutTemplateResponse {
        val template = repository.findByIdAndUserId(templateId, userId)
            ?: throw IllegalArgumentException("Template not found")
        template.name = request.name
        template.exercisesJson = toJson(request.exercises)
        template.updatedAt = Instant.now()
        return repository.save(template).toResponse()
    }

    @Transactional
    fun deleteTemplate(userId: String, templateId: String) {
        val template = repository.findByIdAndUserId(templateId, userId)
            ?: throw IllegalArgumentException("Template not found")
        repository.delete(template)
    }
}
