package com.fitmonitor.common.security

import org.springframework.security.core.context.SecurityContextHolder

object SecurityUtils {
    fun getCurrentUserId(): String {
        val authentication = SecurityContextHolder.getContext().authentication
        return authentication?.principal as? String
            ?: throw IllegalStateException("User not authenticated")
    }
}
