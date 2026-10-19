package com.fitmonitor.common.response

import com.fasterxml.jackson.annotation.JsonInclude
import java.time.Instant

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ApiResponse<T>(
    val data: T? = null,
    val error: String? = null,
    val timestamp: Long = Instant.now().toEpochMilli()
) {
    companion object {
        fun <T> success(data: T): ApiResponse<T> = ApiResponse(data = data)
        fun error(message: String): ApiResponse<Nothing> = ApiResponse(error = message)
    }
}
