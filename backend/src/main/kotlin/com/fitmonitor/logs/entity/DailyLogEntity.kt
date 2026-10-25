package com.fitmonitor.logs.entity

import com.fitmonitor.auth.entity.UserEntity
import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator
import java.time.LocalDate

@Entity
@Table(
    name = "daily_logs",
    uniqueConstraints = [UniqueConstraint(columnNames = ["user_id", "date"])]
)
class DailyLogEntity(
    @Id @UuidGenerator
    var id: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    var user: UserEntity,

    @Column(nullable = false)
    var date: LocalDate = LocalDate.now(),

    var steps: Int = 0,
    var caloriesBurned: Int = 0,
    var caloriesConsumed: Int = 0,
    var heartRateAvg: Int = 0,
    var sleepHours: Double = 0.0,
    var waterCups: Int = 0,
    var weight: Double = 0.0,

    @OneToMany(mappedBy = "dailyLog", cascade = [CascadeType.ALL], orphanRemoval = true)
    var meals: MutableList<MealEntity> = mutableListOf(),

    @OneToMany(mappedBy = "dailyLog", cascade = [CascadeType.ALL], orphanRemoval = true)
    var workouts: MutableList<WorkoutEntity> = mutableListOf()
)
