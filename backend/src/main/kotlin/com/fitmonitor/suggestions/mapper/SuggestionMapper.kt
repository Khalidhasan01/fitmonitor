package com.fitmonitor.suggestions.mapper

import com.fitmonitor.suggestions.dto.SuggestionResponse
import com.fitmonitor.suggestions.entity.SuggestionEntity

fun SuggestionEntity.toResponse() = SuggestionResponse(
    title = title,
    description = description,
    icon = icon
)
