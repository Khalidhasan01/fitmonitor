package com.fitmonitor.logs.entity

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator

@Entity
@Table(name = "exercise_sets")
class ExerciseSetEntity(
    @Id @UuidGenerator
    var id: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id")
    var exercise: ExerciseEntity,

    @Column(nullable = false)
    var setNumber: Int = 1,

    var reps: Int? = null,
    var weight: Double? = null,
    var duration: Int? = null
)
