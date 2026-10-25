package com.fitmonitor.logs.repository

import com.fitmonitor.logs.entity.ExerciseDefinitionEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface ExerciseDefinitionRepository : JpaRepository<ExerciseDefinitionEntity, String> {
    @Query("select e from ExerciseDefinitionEntity e where e.ownerId is null or e.ownerId = :userId order by e.name")
    fun findVisibleTo(userId: String): List<ExerciseDefinitionEntity>

}
