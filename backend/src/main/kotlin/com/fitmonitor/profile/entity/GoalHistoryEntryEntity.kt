package com.fitmonitor.profile.entity

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator
import java.time.LocalDate

@Entity
@Table(name = "goal_history_entries")
class GoalHistoryEntryEntity(
    @Id @UuidGenerator
    var id: String = "",

    @Column(nullable = false)
    var date: LocalDate = LocalDate.now(),

    @Column(nullable = false)
    var type: String = "weight",

    var target: Double = 0.0,
    var achieved: Double = 0.0,
    var hit: Boolean = false
)
