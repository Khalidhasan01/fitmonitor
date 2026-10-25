package com.fitmonitor.common.security

import com.fitmonitor.common.exception.UnauthorizedException
import org.springframework.security.core.context.SecurityContextHolder

object SecurityUtils {
    fun getCurrentUserId(): String {
        val authentication = SecurityContextHolder.getContext().authentication
        return authentication?.principal as? String
            ?: throw UnauthorizedException("User not authenticated")
    }
}
