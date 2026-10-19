package com.fitmonitor.auth.entity

import com.fitmonitor.logs.entity.DailyLogEntity
import com.fitmonitor.profile.entity.UserProfileEntity
import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator

@Entity
@Table(name = "users")
class UserEntity(
    @Id @UuidGenerator
    var id: String = "",

    @Column(nullable = false)
    var name: String = "",

    @Column(nullable = false, unique = true)
    var email: String = "",

    @Column(nullable = false)
    var passwordHash: String = "",

    @OneToOne(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    var profile: UserProfileEntity? = null,

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    var dailyLogs: MutableList<DailyLogEntity> = mutableListOf()
)
