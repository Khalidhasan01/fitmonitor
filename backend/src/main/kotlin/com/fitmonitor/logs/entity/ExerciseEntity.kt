package com.fitmonitor.logs.entity

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator

@Entity
@Table(name = "exercises")
class ExerciseEntity(
    @Id @UuidGenerator
    var id: String = "",

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workout_id")
    var workout: WorkoutEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_definition_id")
    var exerciseDefinition: ExerciseDefinitionEntity? = null,

    @Column(nullable = false)
    var name: String = "",

    @Column(nullable = false)
    var muscleGroup: String = "",

    @OneToMany(mappedBy = "exercise", cascade = [CascadeType.ALL], orphanRemoval = true)
    @OrderBy("setNumber ASC")
    var sets: MutableList<ExerciseSetEntity> = mutableListOf()
)
