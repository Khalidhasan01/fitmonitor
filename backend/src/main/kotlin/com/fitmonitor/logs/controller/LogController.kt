package com.fitmonitor.logs.controller

import com.fitmonitor.common.security.SecurityUtils
import com.fitmonitor.logs.dto.*
import com.fitmonitor.logs.service.*
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/logs")
class LogController(private val logService: LogService) {

    @GetMapping
    fun getLogs(): ResponseEntity<List<DailyLogResponse>> =
        ResponseEntity.ok(logService.getLogs(SecurityUtils.getCurrentUserId()))

    @GetMapping("/latest")
    fun getLatest(): ResponseEntity<DailyLogResponse> =
        ResponseEntity.ok(logService.getLatestLog(SecurityUtils.getCurrentUserId()))

    @GetMapping("/{date}")
    fun getByDate(@PathVariable date: String): ResponseEntity<DailyLogResponse> =
        ResponseEntity.ok(logService.getLog(SecurityUtils.getCurrentUserId(), date))
}

@RestController
@RequestMapping("/api/meals")
class MealController(private val logService: LogService) {

    @GetMapping("/{date}")
    fun getMeals(@PathVariable date: String): ResponseEntity<List<MealResponse>> =
        ResponseEntity.ok(logService.getMeals(SecurityUtils.getCurrentUserId(), date))
}

@RestController
@RequestMapping("/api/workouts")
class WorkoutController(private val workoutService: WorkoutService) {

    @GetMapping
    fun getWorkouts(
        @RequestParam(required = false) start: String?,
        @RequestParam(required = false) end: String?
    ): ResponseEntity<List<WorkoutResponse>> =
        ResponseEntity.ok(workoutService.getWorkouts(SecurityUtils.getCurrentUserId(), start, end))

    @GetMapping("/{id}")
    fun getWorkout(@PathVariable id: String): ResponseEntity<WorkoutResponse> =
        ResponseEntity.ok(workoutService.getWorkout(SecurityUtils.getCurrentUserId(), id))

    @PostMapping
    fun createWorkout(@Valid @RequestBody request: CreateWorkoutRequest): ResponseEntity<WorkoutResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(workoutService.createWorkout(SecurityUtils.getCurrentUserId(), request))

    @PutMapping("/{id}")
    fun updateWorkout(
        @PathVariable id: String,
        @Valid @RequestBody request: CreateWorkoutRequest
    ): ResponseEntity<WorkoutResponse> =
        ResponseEntity.ok(workoutService.updateWorkout(SecurityUtils.getCurrentUserId(), id, request))

    @DeleteMapping("/{id}")
    fun deleteWorkout(@PathVariable id: String): ResponseEntity<Unit> {
        workoutService.deleteWorkout(SecurityUtils.getCurrentUserId(), id)
        return ResponseEntity.noContent().build()
    }
}

@RestController
@RequestMapping("/api/exercises")
class ExerciseController(private val exerciseService: ExerciseService) {

    @GetMapping
    fun getExercises(
        @RequestParam(required = false) muscleGroup: String?,
        @RequestParam(required = false) q: String?
    ): ResponseEntity<List<ExerciseDefinitionResponse>> =
        ResponseEntity.ok(exerciseService.getExercises(SecurityUtils.getCurrentUserId(), muscleGroup, q))

    @PostMapping
    fun createExercise(@Valid @RequestBody request: CreateExerciseDefinitionRequest): ResponseEntity<ExerciseDefinitionResponse> =
        ResponseEntity.status(HttpStatus.CREATED)
            .body(exerciseService.createExercise(SecurityUtils.getCurrentUserId(), request))
}
