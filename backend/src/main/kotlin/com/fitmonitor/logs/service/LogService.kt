package com.fitmonitor.logs.service

import com.fitmonitor.common.exception.ResourceNotFoundException
import com.fitmonitor.common.exception.ValidationException
import com.fitmonitor.logs.dto.DailyLogResponse
import com.fitmonitor.logs.dto.MealResponse
import com.fitmonitor.logs.mapper.toResponse
import com.fitmonitor.logs.repository.DailyLogRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.format.DateTimeParseException

@Service
@Transactional(readOnly = true)
class LogService(
    private val dailyLogRepository: DailyLogRepository
) {
    fun getLogs(userId: String): List<DailyLogResponse> =
        dailyLogRepository.findByUserIdOrderByDateDesc(userId).map { it.toResponse() }

    fun getLog(userId: String, date: String): DailyLogResponse =
        dailyLogRepository.findByUserIdAndDate(userId, parseDate(date))?.toResponse()
            ?: throw ResourceNotFoundException("Log", date)

    fun getLatestLog(userId: String): DailyLogResponse =
        dailyLogRepository.findFirstByUserIdOrderByDateDesc(userId)?.toResponse()
            ?: throw ResourceNotFoundException("Log", "latest")

    /** A day with no log simply has no meals, so this returns an empty list rather than 404. */
    fun getMeals(userId: String, date: String): List<MealResponse> =
        dailyLogRepository.findByUserIdAndDate(userId, parseDate(date))
            ?.meals?.map { it.toResponse() } ?: emptyList()

    companion object {
        fun parseDate(value: String): LocalDate = try {
            LocalDate.parse(value)
        } catch (_: DateTimeParseException) {
            throw ValidationException("Invalid date '$value', expected YYYY-MM-DD")
        }
    }
}
