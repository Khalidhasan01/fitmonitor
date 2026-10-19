package com.fitmonitor.profile.repository

import com.fitmonitor.profile.entity.UserProfileEntity
import org.springframework.data.jpa.repository.JpaRepository

interface UserProfileRepository : JpaRepository<UserProfileEntity, String> {
    fun findByUserId(userId: String): UserProfileEntity?
}
