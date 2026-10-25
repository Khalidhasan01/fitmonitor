package com.fitmonitor.logs.entity

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator

@Entity
@Table(name = "meals")
class MealEntity(
    @Id @UuidGenerator
    var id: String = "",

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "daily_log_id")
    var dailyLog: DailyLogEntity,

    @Column(nullable = false)
    var name: String = "",

    @Column(nullable = false)
    var type: String = "",

    var calories: Int = 0,
    var protein: Int = 0,
    var carbs: Int = 0,
    var fat: Int = 0
)
