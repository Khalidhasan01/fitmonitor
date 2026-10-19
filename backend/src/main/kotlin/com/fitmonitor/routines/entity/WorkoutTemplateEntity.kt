package com.fitmonitor.routines.entity

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator
import java.time.Instant

@Entity
@Table(name = "workout_templates")
class WorkoutTemplateEntity(
    @Id @UuidGenerator
    var id: String = "",

    @Column(nullable = false)
    var userId: String = "",

    @Column(nullable = false)
    var name: String = "",

    @Column(columnDefinition = "TEXT", nullable = false)
    var exercisesJson: String = "[]",

    @Column(nullable = false)
    var createdAt: Instant = Instant.now(),

    @Column(nullable = false)
    var updatedAt: Instant = Instant.now()
)
