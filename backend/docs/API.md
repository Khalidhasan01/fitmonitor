# FitMonitor API

REST API served by the Spring Boot backend. All bodies are JSON unless noted.

- **Base URL:** `http://localhost:8080/api` (dev) — set `VITE_API_URL` in the frontend for other environments.
- **Auth:** every endpoint except the four public auth endpoints needs `Authorization: Bearer <token>`. Tokens come from `signup`/`login`, are HS256 JWTs and expire after 24 h (`app.jwt.expiration-ms`).
- **Dates:** `YYYY-MM-DD`. Timestamps are ISO-8601 strings.
- **Demo account (dev/test seed):** `demo@fitmonitor.com` / `password123`, with 21 days of data.

## Errors

Every error has the same shape:

```json
{ "message": "Human readable reason" }
```

| Status | When |
|--------|------|
| 400 | Validation failed (`message` lists `field: reason; ...`), malformed JSON, bad date or parameter |
| 401 | Missing/invalid/expired token, or bad email/password on login |
| 404 | Resource does not exist **or belongs to another user** |
| 409 | Email already registered, or a database conflict |
| 413 | Uploaded file larger than 2 MB |
| 500 | Unexpected error (details are logged, not returned) |

---

## Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/signup` | public | Create account → `201` |
| POST | `/login` | public | Log in → `200` |
| POST | `/forgot-password` | public | Placeholder: always returns a success message, sends no email |
| POST | `/reset-password` | public | Placeholder: always returns a success message, changes nothing |
| GET | `/me` | token | Current user |
| DELETE | `/account` | token | Delete the account and all its data |

```jsonc
// POST /signup            name: required, ≤100 chars; email: valid; password: 6–128 chars
{ "name": "Jane", "email": "jane@example.com", "password": "secret123" }
// POST /login
{ "email": "jane@example.com", "password": "secret123" }
// → 200/201
{ "user": { "id": "uuid", "name": "Jane", "email": "jane@example.com" }, "token": "<jwt>" }
// POST /forgot-password   { "email": "..." }        POST /reset-password  { "token": "...", "password": "..." }
// → { "message": "..." }
// GET /me → { "id": "uuid", "name": "Jane", "email": "jane@example.com" }
```

Emails are trimmed and lower-cased; uniqueness is case-insensitive.

---

## Daily logs, meals — `/api/logs`, `/api/meals`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/logs` | All daily logs, newest first |
| GET | `/logs/latest` | Most recent log (`404` if the user has none) |
| GET | `/logs/{date}` | Log for a date (`404` if none, `400` if the date is malformed) |
| GET | `/meals/{date}` | Meals for a date (`[]` if the day has no log) |

```jsonc
// DailyLog
{
  "date": "2026-07-24", "steps": 9120, "caloriesBurned": 2300, "caloriesConsumed": 1950,
  "heartRateAvg": 68, "sleepHours": 7.4, "waterCups": 8, "weight": 75.6,
  "meals":    [ { "id": "uuid", "name": "Oatmeal", "type": "breakfast", "calories": 350, "protein": 12, "carbs": 58, "fat": 7 } ],
  "workouts": [ /* Workout, see below */ ]
}
```

> The frontend type allows `null` from `/logs/{date}` and `/logs/latest`; the backend returns `404` instead. The UI does not currently call these two endpoints.

## Workouts — `/api/workouts`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/workouts?start=&end=` | Workouts, newest first. `start`/`end` are optional inclusive dates |
| GET | `/workouts/{id}` | One workout |
| POST | `/workouts` | Create → `201`. Creates that day's log if it does not exist yet |
| PUT | `/workouts/{id}` | Replace the workout (date and exercises). Moving the date re-homes it under that day's log |
| DELETE | `/workouts/{id}` | Delete → `204` |

```jsonc
// POST / PUT body — date required; ≥1 exercise; each exercise ≥1 set; numbers ≥ 0, null allowed
{
  "date": "2026-07-24",
  "exercises": [
    { "exerciseDefinitionId": "uuid-from-/exercises",
      "sets": [ { "reps": 10, "weight": 60.0, "duration": null }, { "reps": 8, "weight": 60.0, "duration": null } ] }
  ]
}
// Workout response (set numbers are assigned 1..n in request order)
{ "id": "uuid", "date": "2026-07-24",
  "exercises": [ { "id": "uuid", "exerciseDefinitionId": "uuid", "name": "Bench Press", "muscleGroup": "Chest",
                   "sets": [ { "set": 1, "reps": 10, "weight": 60.0, "duration": null } ] } ] }
```

`name` and `muscleGroup` are copied from the exercise definition when the workout is saved.

## Exercise library — `/api/exercises`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/exercises?muscleGroup=&q=` | Built-in exercises plus your own, sorted by name. `muscleGroup` is an exact (case-insensitive) match; `q` is a name substring |
| POST | `/exercises` | Create a custom exercise → `201`. Visible only to you; names must be unique among the exercises you can see |

```jsonc
// POST body            // response
{ "name": "Zottman Curl", "muscleGroup": "Biceps" }   →   { "id": "uuid", "name": "Zottman Curl", "muscleGroup": "Biceps" }
```

## Workout templates — `/api/workout-templates`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/workout-templates` | Your templates, most recently updated first |
| GET | `/workout-templates/{id}` | One template |
| POST | `/workout-templates` | Create → `201` |
| PUT | `/workout-templates/{id}` | Replace |
| DELETE | `/workout-templates/{id}` | Delete → `204` |

```jsonc
// body: name required (≤100), ≥1 exercise, each with ≥1 set
{ "name": "Push day",
  "exercises": [ { "exerciseDefinitionId": "uuid", "name": "Bench Press", "muscleGroup": "Chest",
                   "sets": [ { "reps": 10, "weight": 60.0, "duration": null } ] } ] }
// response adds id, createdAt, updatedAt
```

## Suggestions — `/api/suggestions`

`GET /suggestions` → `[ { "title": "...", "description": "...", "icon": "Droplets" } ]`

---

## Profile — `/api/profile`

Most profile endpoints return the full **Profile** object:

```jsonc
{
  "name": "Alex Johnson", "age": 28, "height": 178.0, "weight": 76.5, "goalWeight": 72.0,
  "dailyStepGoal": 10000, "dailyCalorieGoal": 2200, "waterGoal": 8, "sleepGoal": 8,
  "avatarUrl": null, "unitSystem": "metric", "activityLevel": "moderate", "timezone": "Europe/London", "bio": "",
  "goals": { "macros": { "protein": 150, "carbs": 250, "fat": 65 }, "targetDate": null, "targetWeight": 72,
             "bodyFatPercent": null, "restingHR": null, "workoutsPerWeek": 5,
             "history": [ { "date": "2026-06-01", "type": "weight", "target": 75, "achieved": 74.2, "hit": true } ] },
  "notificationPrefs": { "emailNotifications": { "enabled": true, "channels": ["push","email"] },
                         "workoutReminders": { "enabled": true, "channels": ["push"], "time": "09:00" },
                         "mealReminders": { "enabled": false, "channels": ["push"], "time": "12:00" },
                         "weeklyReports": { "enabled": true, "channels": ["email"] },
                         "streakAtRisk": { "enabled": false, "channels": ["push"] },
                         "quietHours": { "start": "22:00", "end": "07:00", "enabled": false } },
  "privacySettings": { "showOnLeaderboard": true, "sharedMetrics": ["steps"], "allowFriendRequests": true,
                       "blockedUsers": [ { "id": "..", "name": "..", "blockedAt": ".." } ],
                       "activeSessions": [ { "id": "s1", "device": "Chrome / macOS", "location": null, "lastActive": "..", "current": true } ] },
  "connectedDevices": [ { "id": "d1", "name": "Apple Watch", "type": "watch", "connected": true, "lastSynced": "..", "syncFrequency": "realtime" } ],
  "appearance": { "theme": "dark", "accentColor": "blue", "density": "comfortable", "widgetOrder": ["steps"] }
}
```

| Method | Path | Body | Returns |
|--------|------|------|---------|
| GET | `/profile` | – | Profile |
| PUT | `/profile` | Partial map of top-level profile fields (`name`, `age`, …, `goals`, `appearance`, …). Unknown keys are ignored; wrong types → `400` | Profile |
| PATCH | `/profile/personal` | `name` 1–100, `age` 1–120, `height` 30–300 cm, `weight`/`goalWeight` 20–500 kg, `unitSystem` `metric`\|`imperial`, `activityLevel`, `timezone` ≤64, `bio` ≤500 — all optional | Profile |
| POST | `/profile/avatar` | multipart `file` (jpg/jpeg/png/gif/webp, ≤2 MB) | `{ "avatarUrl": "data:image/...;base64,..." }` |
| DELETE | `/profile/avatar` | – | Profile |
| DELETE | `/profile` | – | `{ "message" }` — deletes the account |
| PATCH | `/profile/goals` | Goals object | Profile |
| GET | `/profile/goals/history?page=0&size=10` | – | `{ "entries": [...], "page", "size", "total" }` |
| PATCH | `/profile/notifications` | NotificationPrefs object | Profile |
| PATCH | `/profile/privacy` | PrivacySettings object | Profile |
| GET | `/profile/privacy/sessions` | – | ActiveSession[] |
| DELETE | `/profile/privacy/sessions/{sessionId}` | – | Profile |
| GET | `/profile/privacy/blocked-users` | – | BlockedUser[] |
| DELETE | `/profile/privacy/blocked-users/{blockedUserId}` | – | Profile |
| GET | `/profile/devices` | – | ConnectedDevice[] |
| PATCH | `/profile/devices` | Full ConnectedDevice[] (replaces the list) | Profile |
| PATCH | `/profile/devices/{deviceId}/connect` | – | Profile |
| PATCH | `/profile/devices/{deviceId}/disconnect` | – | Profile |
| POST | `/profile/devices/{deviceId}/sync` | – | Profile (sets `lastSynced` to now; no real device sync) |
| PATCH | `/profile/devices/{deviceId}/sync-frequency` | `{ "syncFrequency": "hourly" }` | Profile |
| PATCH | `/profile/appearance` | Appearance object | Profile |
| GET | `/profile/stats` | – | `{ "bmi", "weightToGoal", "activityStreak", "totalLoggedDays", "workoutDays" }` |

`DELETE /api/auth/account` and `DELETE /api/profile` do the same thing.

---

## Configuration

| Variable | Profile | Purpose |
|----------|---------|---------|
| `JWT_SECRET` | prod (required), dev (optional) | HMAC secret, **at least 32 characters**. The app refuses to start without a valid one in prod |
| `DATABASE_URL` | prod | JDBC URL, e.g. `jdbc:postgresql://host:5432/db?user=..&password=..&sslmode=require` |
| `CORS_ORIGINS` | prod | Comma-separated allowed origins |
| `SPRING_PROFILES_ACTIVE` | all | `dev` (default, local Postgres), `prod`, `test` (H2) |

Run: `./gradlew bootRun` · Test: `./gradlew test` · Build: `./gradlew build`.
