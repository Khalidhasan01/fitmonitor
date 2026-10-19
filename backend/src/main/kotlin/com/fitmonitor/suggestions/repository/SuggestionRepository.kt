package com.fitmonitor.suggestions.repository

import com.fitmonitor.suggestions.entity.SuggestionEntity
import org.springframework.data.jpa.repository.JpaRepository

interface SuggestionRepository : JpaRepository<SuggestionEntity, String> {
    fun findByUserId(userId: String): List<SuggestionEntity>
}
