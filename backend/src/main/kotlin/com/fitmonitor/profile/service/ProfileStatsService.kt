package com.fitmonitor.profile.service

import com.fitmonitor.common.exception.ResourceNotFoundException
import com.fitmonitor.logs.repository.DailyLogRepository
import com.fitmonitor.profile.dto.ProfileStatsResponse
import com.fitmonitor.profile.repository.UserProfileRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
@Transactional(readOnly = true)
class ProfileStatsService(
    private val userProfileRepository: UserProfileRepository,
    private val dailyLogRepository: DailyLogRepository
) {
    fun getProfileStats(userId: String): ProfileStatsResponse {
        val profile = userProfileRepository.findByUserId(userId)
            ?: throw ResourceNotFoundException("Profile not found")
        val logs = dailyLogRepository.findByUserIdOrderByDateDesc(userId)

        val bmi = profile.weight / ((profile.height / 100.0) * (profile.height / 100.0))
        val weightToGoal = profile.weight - (profile.goalWeight ?: profile.weight)

        val totalLoggedDays = logs.size
        val workoutDays = logs.count { it.workouts.isNotEmpty() }

        val activityStreak = computeActivityStreak(logs.map { it.date to it.workouts.isNotEmpty() })

        return ProfileStatsResponse(
            bmi = kotlin.math.round(bmi * 10) / 10.0,
            weightToGoal = kotlin.math.round(weightToGoal * 10) / 10.0,
            activityStreak = activityStreak,
            totalLoggedDays = totalLoggedDays,
            workoutDays = workoutDays
        )
    }

    private fun computeActivityStreak(dates: List<Pair<LocalDate, Boolean>>): Int {
        val sorted = dates.sortedByDescending { it.first }
        var streak = 0
        var expected = LocalDate.now()
        for ((date, hasWorkout) in sorted) {
            if (date == expected || date == expected.minusDays(1)) {
                if (hasWorkout) streak++
                else if (date == expected) break
                expected = date.minusDays(1)
            } else {
                break
            }
        }
        return streak
    }
}
