package com.fitmonitor.suggestions.service

import com.fitmonitor.suggestions.dto.SuggestionResponse
import com.fitmonitor.suggestions.mapper.toResponse
import com.fitmonitor.suggestions.repository.SuggestionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class SuggestionService(
    private val suggestionRepository: SuggestionRepository
) {
    fun getSuggestions(userId: String): List<SuggestionResponse> {
        return suggestionRepository.findByUserId(userId)
            .map { it.toResponse() }
    }
}
