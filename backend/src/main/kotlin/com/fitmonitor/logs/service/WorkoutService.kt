package com.fitmonitor.logs.service

import com.fitmonitor.auth.repository.UserRepository
import com.fitmonitor.common.exception.ResourceNotFoundException
import com.fitmonitor.common.exception.ValidationException
import com.fitmonitor.logs.dto.CreateWorkoutRequest
import com.fitmonitor.logs.dto.WorkoutResponse
import com.fitmonitor.logs.entity.*
import com.fitmonitor.logs.mapper.toResponse
import com.fitmonitor.logs.repository.DailyLogRepository
import com.fitmonitor.logs.repository.ExerciseDefinitionRepository
import com.fitmonitor.logs.repository.WorkoutRepository
import com.fitmonitor.profile.repository.UserProfileRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
@Transactional(readOnly = true)
class WorkoutService(
    private val workoutRepository: WorkoutRepository,
    private val dailyLogRepository: DailyLogRepository,
    private val exerciseDefinitionRepository: ExerciseDefinitionRepository,
    private val userRepository: UserRepository,
    private val userProfileRepository: UserProfileRepository
) {
    fun getWorkouts(userId: String, start: String?, end: String?): List<WorkoutResponse> {
        val workouts = if (start == null && end == null) {
            workoutRepository.findByDailyLogUserIdOrderByDateDesc(userId)
        } else {
            val from = start?.let(LogService::parseDate) ?: LocalDate.MIN
            val to = end?.let(LogService::parseDate) ?: LocalDate.MAX
            if (from.isAfter(to)) throw ValidationException("start must not be after end")
            workoutRepository.findByDailyLogUserIdAndDateBetweenOrderByDateDesc(userId, from, to)
        }
        return workouts.map { it.toResponse() }
    }

    fun getWorkout(userId: String, id: String): WorkoutResponse =
        findOwned(userId, id).toResponse()

    @Transactional
    fun createWorkout(userId: String, request: CreateWorkoutRequest): WorkoutResponse {
        val date = LogService.parseDate(request.date)
        val log = dailyLogRepository.findByUserIdAndDate(userId, date) ?: createEmptyLog(userId, date)
        val workout = WorkoutEntity(dailyLog = log, date = date)
        fillExercises(userId, workout, request)
        log.workouts.add(workout)
        dailyLogRepository.saveAndFlush(log)
        return workout.toResponse()
    }

    @Transactional
    fun updateWorkout(userId: String, id: String, request: CreateWorkoutRequest): WorkoutResponse {
        val workout = findOwned(userId, id)
        val date = LogService.parseDate(request.date)
        if (date != workout.date) {
            // Moving a workout to another day re-homes it under that day's log.
            val oldLog = workout.dailyLog
            val newLog = dailyLogRepository.findByUserIdAndDate(userId, date) ?: createEmptyLog(userId, date)
            oldLog.workouts.remove(workout)
            workout.dailyLog = newLog
            workout.date = date
            newLog.workouts.add(workout)
        }
        workout.exercises.clear()
        fillExercises(userId, workout, request)
        workoutRepository.saveAndFlush(workout)
        return workout.toResponse()
    }

    @Transactional
    fun deleteWorkout(userId: String, id: String) {
        val workout = findOwned(userId, id)
        workout.dailyLog.workouts.remove(workout)
        workoutRepository.delete(workout)
    }

    private fun findOwned(userId: String, id: String): WorkoutEntity =
        workoutRepository.findByIdAndDailyLogUserId(id, userId)
            ?: throw ResourceNotFoundException("Workout", id)

    private fun createEmptyLog(userId: String, date: LocalDate): DailyLogEntity {
        val user = userRepository.findById(userId).orElseThrow { ResourceNotFoundException("User", userId) }
        val weight = userProfileRepository.findByUserId(userId)?.weight ?: 0.0
        return dailyLogRepository.save(DailyLogEntity(user = user, date = date, weight = weight))
    }

    private fun fillExercises(userId: String, workout: WorkoutEntity, request: CreateWorkoutRequest) {
        val visible = exerciseDefinitionRepository.findVisibleTo(userId).associateBy { it.id }
        request.exercises.forEach { ex ->
            val definition = visible[ex.exerciseDefinitionId]
                ?: throw ValidationException("Unknown exercise '${ex.exerciseDefinitionId}'")
            val exercise = ExerciseEntity(
                workout = workout,
                exerciseDefinition = definition,
                name = definition.name,
                muscleGroup = definition.muscleGroup
            )
            exercise.sets = ex.sets.mapIndexed { i, s ->
                ExerciseSetEntity(
                    exercise = exercise,
                    setNumber = i + 1,
                    reps = s.reps,
                    weight = s.weight,
                    duration = s.duration
                )
            }.toMutableList()
            workout.exercises.add(exercise)
        }
    }
}
