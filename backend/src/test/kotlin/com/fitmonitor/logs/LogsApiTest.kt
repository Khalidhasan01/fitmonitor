package com.fitmonitor.logs

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
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LogsApiTest(
    @Autowired mvc: MockMvc,
    @Autowired mapper: ObjectMapper
) {
    private val api = ApiClient(mvc, mapper)

    private fun benchPressId(token: String): String =
        api.json(api.call("GET", "/api/exercises?q=bench", token = token))
            .first { it["name"].asText() == "Bench Press" }["id"].asText()

    private fun workoutBody(exerciseId: String, date: String = "2026-03-01", reps: Int = 10) = mapOf(
        "date" to date,
        "exercises" to listOf(mapOf("exerciseDefinitionId" to exerciseId, "sets" to listOf(
            mapOf("reps" to reps, "weight" to 60.0, "duration" to null),
            mapOf("reps" to reps - 2, "weight" to 60.0, "duration" to null)
        )))
    )

    @Test
    fun `demo user sees seeded logs, latest log and meals`() {
        val token = api.login("demo@fitmonitor.com", "password123")
        val logs = api.json(api.call("GET", "/api/logs", token = token).andExpect(status().isOk))
        assertEquals(21, logs.size())
        assertTrue(logs[0]["date"].asText() > logs[1]["date"].asText(), "logs are newest first")

        val latest = logs[0]["date"].asText()
        api.call("GET", "/api/logs/latest", token = token).andExpect(jsonPath("$.date").value(latest))
        api.call("GET", "/api/logs/$latest", token = token).andExpect(jsonPath("$.meals.length()").value(4))
        api.call("GET", "/api/meals/$latest", token = token).andExpect(jsonPath("$.length()").value(4))
    }

    @Test
    fun `unknown or malformed dates behave sensibly`() {
        val token = api.signup("dates@example.com")
        api.call("GET", "/api/logs/2020-01-01", token = token).andExpect(status().isNotFound)
        api.call("GET", "/api/logs/latest", token = token).andExpect(status().isNotFound)
        api.call("GET", "/api/logs/not-a-date", token = token).andExpect(status().isBadRequest)
        api.call("GET", "/api/meals/2020-01-01", token = token)
            .andExpect(status().isOk).andExpect(jsonPath("$.length()").value(0))
    }

    @Test
    fun `workout create, read, update and delete`() {
        val token = api.signup("workouts@example.com")
        val exerciseId = benchPressId(token)

        val created = api.json(
            api.call("POST", "/api/workouts", workoutBody(exerciseId), token)
                .andExpect(status().isCreated)
                .andExpect(jsonPath("$.date").value("2026-03-01"))
                .andExpect(jsonPath("$.exercises[0].name").value("Bench Press"))
                .andExpect(jsonPath("$.exercises[0].sets[1].set").value(2))
        )
        val id = created["id"].asText()

        api.call("GET", "/api/workouts/$id", token = token).andExpect(status().isOk)
        api.call("GET", "/api/workouts?start=2026-03-01&end=2026-03-31", token = token)
            .andExpect(jsonPath("$.length()").value(1))
        api.call("GET", "/api/workouts?start=2026-04-01&end=2026-04-30", token = token)
            .andExpect(jsonPath("$.length()").value(0))
        api.call("GET", "/api/logs/2026-03-01", token = token)
            .andExpect(jsonPath("$.workouts.length()").value(1))

        api.call("PUT", "/api/workouts/$id", workoutBody(exerciseId, date = "2026-03-02", reps = 12), token)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.date").value("2026-03-02"))
            .andExpect(jsonPath("$.exercises[0].sets[0].reps").value(12))
        api.call("GET", "/api/logs/2026-03-01", token = token)
            .andExpect(jsonPath("$.workouts.length()").value(0))

        api.call("DELETE", "/api/workouts/$id", token = token).andExpect(status().isNoContent)
        api.call("GET", "/api/workouts/$id", token = token).andExpect(status().isNotFound)
    }

    @Test
    fun `workout validation and ownership`() {
        val owner = api.signup("owner@example.com")
        val other = api.signup("other@example.com")
        val exerciseId = benchPressId(owner)
        val id = api.json(api.call("POST", "/api/workouts", workoutBody(exerciseId), owner))["id"].asText()

        api.call("POST", "/api/workouts", mapOf("date" to "2026-03-01", "exercises" to emptyList<Any>()), owner)
            .andExpect(status().isBadRequest)
        api.call("POST", "/api/workouts", workoutBody("does-not-exist"), owner).andExpect(status().isBadRequest)
        api.call("POST", "/api/workouts", workoutBody(exerciseId, date = "03/01/2026"), owner).andExpect(status().isBadRequest)

        api.call("GET", "/api/workouts/$id", token = other).andExpect(status().isNotFound)
        api.call("DELETE", "/api/workouts/$id", token = other).andExpect(status().isNotFound)
        api.call("PUT", "/api/workouts/$id", workoutBody(exerciseId), other).andExpect(status().isNotFound)
    }

    @Test
    fun `exercise library filters, search and custom exercises are private`() {
        val a = api.signup("lib-a@example.com")
        val b = api.signup("lib-b@example.com")

        api.call("GET", "/api/exercises?muscleGroup=Cardio", token = a)
            .andExpect(jsonPath("$.length()").value(4))
        api.call("POST", "/api/exercises", mapOf("name" to "Zottman Curl", "muscleGroup" to "Biceps"), a)
            .andExpect(status().isCreated).andExpect(jsonPath("$.name").value("Zottman Curl"))
        api.call("POST", "/api/exercises", mapOf("name" to "zottman curl", "muscleGroup" to "Biceps"), a)
            .andExpect(status().isBadRequest)
        api.call("POST", "/api/exercises", mapOf("name" to "", "muscleGroup" to "Biceps"), a)
            .andExpect(status().isBadRequest)

        api.call("GET", "/api/exercises?q=zottman", token = a).andExpect(jsonPath("$.length()").value(1))
        api.call("GET", "/api/exercises?q=zottman", token = b).andExpect(jsonPath("$.length()").value(0))
    }

    @Test
    fun `profile stats reflect the seeded demo data`() {
        val token = api.login("demo@fitmonitor.com", "password123")
        api.call("GET", "/api/profile/stats", token = token)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.totalLoggedDays").value(21))
    }
}
