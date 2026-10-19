package com.fitmonitor.routines.repository

import com.fitmonitor.routines.entity.WorkoutTemplateEntity
import org.springframework.data.jpa.repository.JpaRepository

interface WorkoutTemplateRepository : JpaRepository<WorkoutTemplateEntity, String> {
    fun findByUserIdOrderByUpdatedAtDesc(userId: String): List<WorkoutTemplateEntity>
    fun findByIdAndUserId(id: String, userId: String): WorkoutTemplateEntity?
}
