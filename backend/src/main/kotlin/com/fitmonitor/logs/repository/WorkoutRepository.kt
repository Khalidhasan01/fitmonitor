package com.fitmonitor.logs.repository

import com.fitmonitor.logs.entity.WorkoutEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDate

interface WorkoutRepository : JpaRepository<WorkoutEntity, String> {
    fun findByDailyLogUserIdOrderByDateDesc(userId: String): List<WorkoutEntity>
    fun findByDailyLogUserIdAndDateBetweenOrderByDateDesc(userId: String, start: LocalDate, end: LocalDate): List<WorkoutEntity>
    fun findByIdAndDailyLogUserId(id: String, userId: String): WorkoutEntity?
}
