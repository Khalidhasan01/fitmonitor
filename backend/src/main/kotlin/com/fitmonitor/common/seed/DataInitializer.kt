package com.fitmonitor.common.seed

import com.fitmonitor.auth.entity.UserEntity
import com.fitmonitor.auth.repository.UserRepository
import com.fitmonitor.logs.entity.*
import com.fitmonitor.logs.repository.ExerciseDefinitionRepository
import com.fitmonitor.profile.entity.UserProfileEntity
import com.fitmonitor.suggestions.entity.SuggestionEntity
import com.fitmonitor.suggestions.repository.SuggestionRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import kotlin.math.sin
import kotlin.random.Random

@Component
class DataInitializer(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val suggestionRepository: SuggestionRepository,
    private val exerciseDefinitionRepository: ExerciseDefinitionRepository
) : CommandLineRunner {

    private val rng = Random(42)

    override fun run(vararg args: String?) {
        seedExerciseDefinitions()

        if (userRepository.existsByEmail("demo@fitmonitor.com")) return

        createDemoData()
    }

    @Transactional
    fun seedExerciseDefinitions() {
        if (exerciseDefinitionRepository.count() > 0) return

        createExerciseDefinitions()
    }

    @Transactional
    fun createDemoData() {
        val user = UserEntity(
            name = "Alex Johnson",
            email = "demo@fitmonitor.com",
            passwordHash = passwordEncoder.encode("password123")
        )
        user.profile = UserProfileEntity(user = user).apply {
            age = 28
            height = 178.0
            weight = 76.5
            goalWeight = 72.0
            dailyStepGoal = 10000
            dailyCalorieGoal = 2200
            waterGoal = 8
            sleepGoal = 8
            unitSystem = "metric"
            activityLevel = "moderate"
            timezone = java.time.ZoneId.systemDefault().id
            goalsJson = """{"macros":{"protein":150,"carbs":250,"fat":65},"targetDate":null,"targetWeight":72,"bodyFatPercent":null,"restingHR":null,"workoutsPerWeek":5,"history":[{"date":"2026-06-01","type":"weight","target":75,"achieved":74.2,"hit":true},{"date":"2026-05-01","type":"weight","target":78,"achieved":76,"hit":true},{"date":"2026-04-01","type":"workouts","target":20,"achieved":18,"hit":false}]}"""
            notificationPrefsJson = """{"emailNotifications":{"enabled":true,"channels":["push","email"]},"workoutReminders":{"enabled":true,"channels":["push"],"time":"09:00"},"mealReminders":{"enabled":false,"channels":["push"],"time":"12:00"},"weeklyReports":{"enabled":true,"channels":["email"]},"streakAtRisk":{"enabled":false,"channels":["push"]},"quietHours":{"start":"22:00","end":"07:00","enabled":false}}"""
            privacySettingsJson = """{"showOnLeaderboard":true,"sharedMetrics":["steps","workouts"],"allowFriendRequests":true,"blockedUsers":[],"activeSessions":[{"id":"s1","device":"Chrome / macOS","location":null,"lastActive":"2026-07-24T10:30:00","current":true},{"id":"s2","device":"Safari / iPhone","location":null,"lastActive":"2026-07-23T18:00:00","current":false}]}"""
            connectedDevicesJson = """[{"id":"d1","name":"Apple Watch","type":"watch","connected":true,"lastSynced":"2026-07-24T10:15:00","syncFrequency":"realtime"},{"id":"d2","name":"Fitbit Charge 6","type":"tracker","connected":false,"lastSynced":null,"syncFrequency":"hourly"},{"id":"d3","name":"Garmin Forerunner","type":"watch","connected":false,"lastSynced":null,"syncFrequency":"daily"},{"id":"d4","name":"Apple Health","type":"health_platform","connected":false,"lastSynced":null,"syncFrequency":"realtime"},{"id":"d5","name":"Google Fit","type":"health_platform","connected":false,"lastSynced":null,"syncFrequency":"realtime"},{"id":"d6","name":"Strava","type":"health_platform","connected":false,"lastSynced":null,"syncFrequency":"realtime"}]"""
        }

        val savedUser = userRepository.save(user)

        val exerciseDefinitions = exerciseDefinitionRepository.findAll()
        val defMap = exerciseDefinitions.associateBy { it.name }

        val today = LocalDate.now()
        for (i in 20 downTo 0) {
            val date = today.minusDays(i.toLong())
            val log = createDailyLog(savedUser, date, 20 - i, defMap)
            savedUser.dailyLogs.add(log)
        }

        val suggestions = listOf(
            Triple("Stay Hydrated", "Drink at least 8 cups of water today. Try adding lemon for flavor.", "Droplets"),
            Triple("Mix Up Your Cardio", "Try interval training: 30s sprint, 60s jog, repeat 8 times.", "Zap"),
            Triple("Protein Timing", "Have protein within 30min post-workout for optimal recovery.", "Clock"),
            Triple("Sleep Matters", "Aim for 7-8 hours of sleep. Your muscles repair while you rest.", "Moon"),
            Triple("Track Your Meals", "Logging meals helps you stay accountable to your nutrition goals.", "ClipboardList"),
            Triple("Warm Up Properly", "Dynamic stretches before lifting reduce injury risk.", "Activity")
        )

        suggestions.forEach { (title, desc, icon) ->
            suggestionRepository.save(
                SuggestionEntity(
                    user = savedUser,
                    title = title,
                    description = desc,
                    icon = icon
                )
            )
        }
    }

    private fun createDailyLog(user: UserEntity, date: LocalDate, index: Int, defMap: Map<String, ExerciseDefinitionEntity>): DailyLogEntity {
        val hasWorkout = index % 3 != 1
        val steps = randomInt(5000, 15000)

        val log = DailyLogEntity(
            user = user,
            date = date,
            steps = steps,
            caloriesBurned = randomInt(1800, 2800),
            caloriesConsumed = randomInt(1800, 2500),
            heartRateAvg = randomInt(62, 78),
            sleepHours = kotlin.math.round((rng.nextDouble() * 3 + 5.5) * 10) / 10.0,
            waterCups = randomInt(4, 10),
            weight = kotlin.math.round((75.0 + sin(index / 7.0) * 2.0 + (rng.nextDouble() - 0.5) * 1.5) * 10) / 10.0
        )

        log.meals = mutableListOf(
            createMeal(log, "Oatmeal with Berries", "breakfast", 350, 12, 58, 7),
            createMeal(log, "Grilled Chicken Salad", "lunch", 450, 42, 20, 22),
            createMeal(log, "Salmon with Rice", "dinner", 580, 45, 55, 18),
            createMeal(log, "Mixed Nuts", "snack", 170, 5, 6, 15)
        )

        if (hasWorkout) {
            val workout = WorkoutEntity(
                dailyLog = log,
                date = date
            )

            val exercisesList = listOf(
                "Bench Press" to "Chest",
                "Pull Ups" to "Back",
                "Squat" to "Legs",
                "Overhead Press" to "Shoulders"
            )

            exercisesList.forEach { (name, muscle) ->
                val definition = defMap[name]
                val exercise = ExerciseEntity(
                    workout = workout,
                    exerciseDefinition = definition,
                    name = name,
                    muscleGroup = muscle
                )
                val setCount = randomInt(3, 4)
                exercise.sets = (1..setCount).map { setNum ->
                    ExerciseSetEntity(
                        exercise = exercise,
                        setNumber = setNum,
                        reps = if (muscle != "Cardio") randomInt(8, 15) else null,
                        weight = if (muscle != "Cardio") randomInt(10, 100).toDouble() else null,
                        duration = if (muscle == "Cardio") randomInt(10, 45) else null
                    )
                }.toMutableList()
                workout.exercises.add(exercise)
            }

            log.workouts = mutableListOf(workout)
        }

        return log
    }

    private fun createExerciseDefinitions(): List<ExerciseDefinitionEntity> {
        val exercises = listOf(
            "Bench Press" to "Chest",
            "Incline Bench Press" to "Chest",
            "Dumbbell Fly" to "Chest",
            "Push Ups" to "Chest",
            "Pull Ups" to "Back",
            "Barbell Row" to "Back",
            "Lat Pulldown" to "Back",
            "Deadlift" to "Back",
            "Squat" to "Legs",
            "Leg Press" to "Legs",
            "Romanian Deadlift" to "Legs",
            "Lunges" to "Legs",
            "Overhead Press" to "Shoulders",
            "Lateral Raise" to "Shoulders",
            "Front Raise" to "Shoulders",
            "Face Pull" to "Shoulders",
            "Barbell Curl" to "Biceps",
            "Hammer Curl" to "Biceps",
            "Triceps Pushdown" to "Triceps",
            "Skull Crushers" to "Triceps",
            "Plank" to "Core",
            "Crunches" to "Core",
            "Russian Twist" to "Core",
            "Running" to "Cardio",
            "Cycling" to "Cardio",
            "Rowing" to "Cardio",
            "Jump Rope" to "Cardio"
        )
        return exercises.map { (name, muscle) ->
            exerciseDefinitionRepository.save(
                ExerciseDefinitionEntity(
                    name = name,
                    muscleGroup = muscle,
                    isCustom = false
                )
            )
        }
    }

    private fun createMeal(log: DailyLogEntity, name: String, type: String, calories: Int, protein: Int, carbs: Int, fat: Int) =
        MealEntity(
            dailyLog = log,
            name = name,
            type = type,
            calories = calories,
            protein = protein,
            carbs = carbs,
            fat = fat
        )

    private fun randomInt(min: Int, max: Int): Int = rng.nextInt(max - min + 1) + min
}
