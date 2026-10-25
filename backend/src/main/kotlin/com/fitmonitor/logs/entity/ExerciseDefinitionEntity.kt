package com.fitmonitor.logs.entity

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator

/** Library exercise. Built-ins have a null [ownerId]; custom ones belong to the user who created them. */
@Entity
@Table(name = "exercise_definitions")
class ExerciseDefinitionEntity(
    @Id @UuidGenerator
    var id: String = "",

    @Column(nullable = false)
    var name: String = "",

    @Column(nullable = false)
    var muscleGroup: String = "",

    @Column(nullable = false)
    var isCustom: Boolean = false,

    var ownerId: String? = null
)
