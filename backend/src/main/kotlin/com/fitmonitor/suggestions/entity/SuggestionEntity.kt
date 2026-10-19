package com.fitmonitor.suggestions.entity

import com.fitmonitor.auth.entity.UserEntity
import jakarta.persistence.*
import org.hibernate.annotations.UuidGenerator

@Entity
@Table(name = "suggestions")
class SuggestionEntity(
    @Id @UuidGenerator
    var id: String = "",

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: UserEntity = UserEntity(),

    @Column(nullable = false)
    var title: String = "",

    @Column(length = 1000)
    var description: String = "",

    var icon: String = ""
)
