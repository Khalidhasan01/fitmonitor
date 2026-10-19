package com.fitmonitor.routines.controller

import com.fitmonitor.common.security.SecurityUtils
import com.fitmonitor.routines.dto.CreateWorkoutTemplateRequest
import com.fitmonitor.routines.dto.WorkoutTemplateResponse
import com.fitmonitor.routines.service.WorkoutTemplateService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/workout-templates")
class WorkoutTemplateController(
    private val service: WorkoutTemplateService
) {
    @GetMapping
    fun getTemplates(): ResponseEntity<List<WorkoutTemplateResponse>> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(service.getTemplates(userId))
    }

    @GetMapping("/{id}")
    fun getTemplateById(@PathVariable id: String): ResponseEntity<WorkoutTemplateResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(service.getTemplateById(userId, id))
    }

    @PostMapping
    fun createTemplate(@RequestBody request: CreateWorkoutTemplateRequest): ResponseEntity<WorkoutTemplateResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createTemplate(userId, request))
    }

    @PutMapping("/{id}")
    fun updateTemplate(
        @PathVariable id: String,
        @RequestBody request: CreateWorkoutTemplateRequest
    ): ResponseEntity<WorkoutTemplateResponse> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(service.updateTemplate(userId, id, request))
    }

    @DeleteMapping("/{id}")
    fun deleteTemplate(@PathVariable id: String): ResponseEntity<Unit> {
        val userId = SecurityUtils.getCurrentUserId()
        service.deleteTemplate(userId, id)
        return ResponseEntity.noContent().build()
    }
}
