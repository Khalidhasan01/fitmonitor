package com.fitmonitor.logs.entity

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator
import java.time.LocalDate

@Entity
@Table(name = "workouts")
class WorkoutEntity(
    @Id @UuidGenerator
    var id: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "daily_log_id")
    var dailyLog: DailyLogEntity,

    @Column(nullable = false)
    var date: LocalDate = LocalDate.now(),

    @OneToMany(mappedBy = "workout", cascade = [CascadeType.ALL], orphanRemoval = true)
    var exercises: MutableList<ExerciseEntity> = mutableListOf()
)
