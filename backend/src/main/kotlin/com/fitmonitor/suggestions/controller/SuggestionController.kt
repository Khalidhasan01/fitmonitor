package com.fitmonitor.suggestions.controller

import com.fitmonitor.common.security.SecurityUtils
import com.fitmonitor.suggestions.dto.SuggestionResponse
import com.fitmonitor.suggestions.service.SuggestionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/suggestions")
class SuggestionController(
    private val suggestionService: SuggestionService
) {
    @GetMapping
    fun getSuggestions(): ResponseEntity<List<SuggestionResponse>> {
        val userId = SecurityUtils.getCurrentUserId()
        return ResponseEntity.ok(suggestionService.getSuggestions(userId))
    }
}
