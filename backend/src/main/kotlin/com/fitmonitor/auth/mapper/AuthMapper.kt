package com.fitmonitor.auth.mapper

import com.fitmonitor.auth.dto.UserResponse
import com.fitmonitor.auth.entity.UserEntity

fun UserEntity.toUserResponse() = UserResponse(
    id = id,
    name = name,
    email = email
)
