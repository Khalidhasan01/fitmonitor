package com.fitmonitor.logs.repository

import com.fitmonitor.logs.entity.DailyLogEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDate

interface DailyLogRepository : JpaRepository<DailyLogEntity, String> {
    fun findByUserIdOrderByDateDesc(userId: String): List<DailyLogEntity>
    fun findByUserIdAndDate(userId: String, date: LocalDate): DailyLogEntity?
    fun findFirstByUserIdOrderByDateDesc(userId: String): DailyLogEntity?
}
