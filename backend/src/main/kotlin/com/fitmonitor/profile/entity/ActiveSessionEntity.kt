package com.fitmonitor.profile.entity

import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator
import java.time.LocalDateTime

@Entity
@Table(name = "active_sessions")
class ActiveSessionEntity(
    @Id @UuidGenerator
    var id: String = "",

    @Column(nullable = false)
    var device: String = "",

    var location: String? = null,

    @Column(nullable = false)
    var lastActive: LocalDateTime = LocalDateTime.now(),

    var current: Boolean = false
)
