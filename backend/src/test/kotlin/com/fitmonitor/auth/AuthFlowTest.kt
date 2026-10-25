package com.fitmonitor.auth

import com.fasterxml.jackson.databind.ObjectMapper
import com.fitmonitor.ApiClient
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import kotlin.test.assertNotEquals

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthFlowTest(
    @Autowired mvc: MockMvc,
    @Autowired mapper: ObjectMapper
) {
    private val api = ApiClient(mvc, mapper)

    @Test
    fun `signup returns 201 with user and token, and the token opens me`() {
        val res = api.call("POST", "/api/auth/signup", mapOf("name" to "Jane", "email" to "Jane@Example.com", "password" to "secret123"))
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.user.email").value("jane@example.com"))
            .andExpect(jsonPath("$.user.name").value("Jane"))
        val token = api.json(res)["token"].asText()

        api.call("GET", "/api/auth/me", token = token)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.email").value("jane@example.com"))
    }

    @Test
    fun `duplicate email is a 409 regardless of case`() {
        api.signup("dupe@example.com")
        api.call("POST", "/api/auth/signup", mapOf("name" to "Other", "email" to "DUPE@example.com", "password" to "secret123"))
            .andExpect(status().isConflict)
            .andExpect(jsonPath("$.message").value("An account with this email already exists"))
    }

    @Test
    fun `login succeeds with the right password and fails with 401 otherwise`() {
        api.signup("login@example.com", password = "secret123")
        api.call("POST", "/api/auth/login", mapOf("email" to "login@example.com", "password" to "secret123"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.token").isNotEmpty)
        api.call("POST", "/api/auth/login", mapOf("email" to "login@example.com", "password" to "wrong-password"))
            .andExpect(status().isUnauthorized)
            .andExpect(jsonPath("$.message").value("Invalid email or password"))
        api.call("POST", "/api/auth/login", mapOf("email" to "nobody@example.com", "password" to "secret123"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `invalid signup bodies are rejected with 400`() {
        api.call("POST", "/api/auth/signup", mapOf("name" to "", "email" to "not-an-email", "password" to "123"))
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.message").isNotEmpty)
        api.call("POST", "/api/auth/signup", mapOf("name" to "X"))
            .andExpect(status().isBadRequest)
    }

    @Test
    fun `protected endpoints return a JSON 401 without a valid token`() {
        api.call("GET", "/api/auth/me")
            .andExpect(status().isUnauthorized)
            .andExpect(jsonPath("$.message").value("Authentication required"))
        api.call("GET", "/api/profile", token = "garbage")
            .andExpect(status().isUnauthorized)
        api.call("GET", "/api/logs")
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `deleting the account invalidates future logins`() {
        val token = api.signup("gone@example.com")
        api.call("DELETE", "/api/auth/account", token = token).andExpect(status().isOk)
        api.call("POST", "/api/auth/login", mapOf("email" to "gone@example.com", "password" to "secret123"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `each login issues a usable token`() {
        api.signup("multi@example.com")
        val a = api.login("multi@example.com", "secret123")
        api.call("GET", "/api/auth/me", token = a).andExpect(status().isOk)
        assertNotEquals("", a)
    }
}
