package com.fitmonitor.auth.repository

import com.fitmonitor.auth.entity.UserEntity
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<UserEntity, String> {
    fun findByEmail(email: String): UserEntity?
    fun existsByEmail(email: String): Boolean
}
