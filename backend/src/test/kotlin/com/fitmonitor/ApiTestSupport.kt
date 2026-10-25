package com.fitmonitor

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder

/** Small helpers shared by the MockMvc integration tests. */
class ApiClient(private val mvc: MockMvc, val mapper: ObjectMapper) {

    fun call(
        method: String,
        path: String,
        body: Any? = null,
        token: String? = null
    ): ResultActions {
        val builder: MockHttpServletRequestBuilder = request(org.springframework.http.HttpMethod.valueOf(method), path)
        if (body != null) builder.contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(body))
        if (token != null) builder.header("Authorization", "Bearer $token")
        return mvc.perform(builder)
    }

    fun json(result: ResultActions): JsonNode = mapper.readTree(result.andReturn().response.contentAsString)

    fun signup(email: String, password: String = "secret123", name: String = "Test User"): String =
        json(call("POST", "/api/auth/signup", mapOf("name" to name, "email" to email, "password" to password)))["token"].asText()

    fun login(email: String, password: String): String =
        json(call("POST", "/api/auth/login", mapOf("email" to email, "password" to password)))["token"].asText()
}
