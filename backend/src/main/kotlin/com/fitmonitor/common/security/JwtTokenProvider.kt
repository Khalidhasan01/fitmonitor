package com.fitmonitor.common.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value("\${app.jwt.secret:}") jwtSecret: String,
    @Value("\${app.jwt.expiration-ms}") private val expirationMs: Long
) {
    // Built eagerly so a missing or weak secret stops the application at startup.
    private val key: SecretKey = buildKey(jwtSecret)

    fun generateToken(userId: String): String {
        val now = Date()
        return Jwts.builder()
            .subject(userId)
            .issuedAt(now)
            .expiration(Date(now.time + expirationMs))
            .signWith(key)
            .compact()
    }

    fun getUserIdFromToken(token: String): String = parseClaims(token).subject

    fun validateToken(token: String): Boolean =
        try {
            parseClaims(token)
            true
        } catch (_: JwtException) {
            false
        } catch (_: IllegalArgumentException) {
            false
        }

    private fun parseClaims(token: String): Claims =
        Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload

    private fun buildKey(secret: String): SecretKey {
        val bytes = secret.toByteArray()
        check(bytes.size >= MIN_SECRET_BYTES) {
            "app.jwt.secret (JWT_SECRET) must be set to at least $MIN_SECRET_BYTES characters"
        }
        return Keys.hmacShaKeyFor(bytes)
    }

    private companion object {
        const val MIN_SECRET_BYTES = 32
    }
}
