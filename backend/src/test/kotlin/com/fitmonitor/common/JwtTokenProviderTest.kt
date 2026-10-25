package com.fitmonitor.common

import com.fitmonitor.common.security.JwtTokenProvider
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class JwtTokenProviderTest {
    private val secret = "unit-test-secret-unit-test-secret-1234"

    @Test
    fun `token round trips the user id`() {
        val provider = JwtTokenProvider(secret, 60_000)
        val token = provider.generateToken("user-1")
        assertTrue(provider.validateToken(token))
        assertEquals("user-1", provider.getUserIdFromToken(token))
    }

    @Test
    fun `tampered, foreign and expired tokens are rejected`() {
        val provider = JwtTokenProvider(secret, 60_000)
        val token = provider.generateToken("user-1")
        assertFalse(provider.validateToken(token.dropLast(2) + "xx"))
        assertFalse(provider.validateToken(JwtTokenProvider("another-secret-another-secret-12345", 60_000).generateToken("user-1")))
        assertFalse(provider.validateToken("not-a-jwt"))
        assertFalse(provider.validateToken(JwtTokenProvider(secret, -1_000).generateToken("user-1")))
    }

    @Test
    fun `missing or short secret fails fast`() {
        assertThrows<IllegalStateException> { JwtTokenProvider("", 60_000) }
        assertThrows<IllegalStateException> { JwtTokenProvider("too-short", 60_000) }
    }
}
