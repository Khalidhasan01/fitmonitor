# FitMonitor — Coding Rules & Patterns

## 1. General Principles

- Write code that is **explicit, consistent, and self-documenting** — no comments unless absolutely necessary
- No `any` types, no `@ts-ignore`, no `// eslint-disable-next-line`
- Prefer composition over inheritance
- Every file should have a single, clear responsibility
- Follow existing patterns in the codebase — when in doubt, mimic neighboring files

---

## 2. TypeScript Conventions

### Strict Mode

```json
// tsconfig.json — already enabled
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"noFallthroughCasesInSwitch": true
```

### Type Definitions

- All shared types live in `src/types/` — one file per domain (`auth.ts`, `logs.ts`, `profile.ts`, `suggestions.ts`, `contexts.ts`)
- Barrel re-export everything from `src/types/index.ts`
- Use `interface` for object shapes, `type` for unions, aliases, and tuples

```ts
// ✓ Good — interface for objects
export interface DailyLog {
  date: string;
  steps: number;
  meals: Meal[];
  workouts: Workout[];
}

// ✓ Good — type for unions
export type UnitSystem = "metric" | "imperial";
export type ThemeMode = "light" | "dark" | "smart";

// ✓ Good — discriminated union for reducer actions
export type LogsAction =
  | { type: "SET_LOGS"; payload: DailyLog[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
```

### Component Props

Always define a local `interface Props` (or `XxxProps` for feature components) above the component:

```ts
// Shared UI component — always `Props`
interface Props {
  children: React.ReactNode;
  padding?: boolean;
  className?: string;
}

// Feature component — use descriptive name
interface PersonalTabProps {
  form: UserProfile;
  updateForm: (path: string, value: unknown) => void;
  editing: boolean;
  setEditing: (v: boolean) => void;
  handleSaveForm: () => void;
}
```

---

## 3. File & Folder Structure

```
src/
├── types/               # Shared TypeScript types (barrel via index.ts)
├── context/             # React Context providers
├── services/            # API layer (async functions)
├── data/                # Demo/mock data
├── utils/               # Pure utility functions
├── hooks/               # Custom React hooks
├── components/
│   └── ui/              # Shared presentational components
└── features/
    └── {feature}/
        ├── pages/       # Route-level page components
        └── components/  # Feature-specific components
```

### Naming Rules

| Asset           | Convention     | Examples                           |
| --------------- | -------------- | ---------------------------------- |
| Component files | PascalCase.tsx | `Card.tsx`, `PersonalTab.tsx`      |
| Utility files   | camelCase.ts   | `units.ts`, `api.ts`               |
| Hook files      | camelCase.ts   | `useForm.ts`, `useLocalStorage.ts` |
| Type files      | camelCase.ts   | `auth.ts`, `profile.ts`            |
| Data files      | camelCase.ts   | `demoData.ts`                      |
| Pages           | PascalCase.tsx | `Dashboard.tsx`, `Profile.tsx`     |

### Exports

- **Components**: Always `export default`
- **Hooks**: Always named `export function useXxx()`
- **Utilities**: Named exports only
- **Types**: Named `export type` / `export interface`
- **Context providers**: Named `export function XxxProvider()` + `export function useXxx()`

---

## 4. Component Patterns

### Shared UI Components (`src/components/ui/`)

- Pure presentational — no context, no side effects
- Props are explicit, no implicit dependencies
- Accept `className?: string` for Tailwind composition
- Default export

```ts
interface Props {
  children: React.ReactNode
  padding?: boolean
  className?: string
}

export default function Card({ children, padding = true, className = '' }: Props) {
  return (
    <div className={`bg-white dark:bg-gray-900 ... ${padding ? 'p-4 md:p-6' : ''} ${className}`}>
      {children}
    </div>
  )
}
```

### Feature Components (`src/features/{feature}/components/`)

- Named props interface: `{Feature}TabProps`, `{Feature}FormProps`
- Receive data and callbacks via props from parent page
- May consume context directly when it makes sense (e.g., `AppearanceTab` reading `useDarkMode`)

### Page Components (`src/features/{feature}/pages/`)

- Route-level — consumes context, orchestrates data flow
- Manages loading/error/empty states
- Returns `null` or `<LoadingSpinner />` during loading
- Always wraps content in responsive padding: `space-y-6 md:space-y-8`

```ts
export default function Dashboard() {
  const { logs, loading: logsLoading } = useLogs()
  const { profile } = useProfile()

  if (loading) return <LoadingSpinner />
  if (!latest || !profile) return null

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader title="Dashboard" subtitle="Your fitness overview" />
      {/* content */}
    </div>
  )
}
```

---

## 5. State Management Pattern

### Context + useReducer (global state)

Every context follows the same blueprint:

```ts
const XxxContext = createContext<XxxContextValue | null>(null)

const initialState = { data: [], loading: true, error: null }

function reducer(state, action: XxxAction) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function XxxProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    api.getXxx()
      .then((data) => dispatch({ type: 'SET_DATA', payload: data }))
      .catch((err) => dispatch({ type: 'SET_ERROR', payload: err.message }))
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }))
  }, [])

  return (
    <XxxContext.Provider value={{ ...state, dispatch }}>
      {children}
    </XxxContext.Provider>
  )
}

export function useXxx() {
  const context = useContext(XxxContext)
  if (!context) throw new Error('useXxx must be used within XxxProvider')
  return context
}
```

### Action naming

- `SET_DATA` — sets the primary payload
- `SET_LOADING` — boolean
- `SET_ERROR` — string | null

### Provider nesting order (in `App.tsx`)

```
DarkModeProvider > AuthProvider > LogsProvider > ProfileProvider > SuggestionsProvider
```

### Context value types

Defined in `src/types/contexts.ts`, imported from domain type files. Always `createContext<Type | null>(null)`.

---

## 6. Local State & Forms

### useForm hook

For form state with deep nested objects:

```ts
const { form, setForm, updateForm, resetForm } = useForm(initialData);
```

- `updateForm(path, value)` — dot-separated path (e.g., `'goals.macros.protein'`)
- Always deep-clones with `JSON.parse(JSON.stringify(...))` for immutability
- Used in Profile page for tab-based form editing

### Component-level state

- `useState` for UI state (toggles, active tabs, modals)
- `useCallback` for all functions passed as props
- `useMemo` for derived/computed values
- `useLocalStorage(key, defaultValue)` for persisted preferences

### useLocalStorage hook

```ts
const [value, setValue] = useLocalStorage<AuthSession | null>(
  "fitmonitor_auth",
  null,
);
```

- Prefix keys with `fitmonitor_` to avoid collisions
- Handles JSON serialization/deserialization
- Removes key from localStorage when value is `null`/`undefined`

---

## 7. Custom Hooks

All follow the pattern: `useXxx(...dependencies): ReturnType`

```ts
export function useForm<T extends Record<string, unknown>>(initialValue: T) {
  const [form, setForm] = useState<T>(() => JSON.parse(JSON.stringify(initialValue)))
  const updateForm = useCallback((path: string, value: unknown) => { ... }, [])
  const resetForm = useCallback(() => { ... }, [initialValue])
  return { form, setForm, updateForm, resetForm }
}
```

```ts
export function useUnitConversion(unitSystem?: UnitSystem) {
  return useMemo(
    () => ({
      formatWeight: (kg: number) => formatWeight(kg, unitSystem || "metric"),
      isMetric: (unitSystem || "metric") === "metric",
    }),
    [unitSystem],
  );
}
```

---

## 8. API Layer (`src/services/api.ts`)

- All functions are `async` — return `Promise<T>`
- Simulated delay via `delay(ms)` helper
- Deep clone data before returning to prevent mutation leaks: `JSON.parse(JSON.stringify(obj))`
- In-place mutations use `Object.assign(target, deepClone(updates))`
- Functions return typed values (imported from `src/types/`)

```ts
export async function getUserProfile(): Promise<UserProfile> {
  await delay();
  return deepClone(userProfile);
}
```

---

## 9. Routing & Pages

- React Router v7 with `BrowserRouter`
- Public routes: `/`, `/forgot-password`, `/reset-password`
- Protected routes wrapped in `<ProtectedRoute>` — redirects to `/` if unauthenticated
- Catch-all `*` route navigates to `/`
- Feature pages are lazy-loaded via standard import (not `lazy` for now)

```ts
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
<Route path="*" element={<Navigate to="/" replace />} />
```

---

## 10. Styling with Tailwind CSS v4

### Dark mode

- Applied via `.dark` class on `<html>`, toggled by `DarkModeContext`
- All components use `dark:` prefix: `text-gray-900 dark:text-gray-100`
- Use `dark:border-gray-700`, `dark:bg-gray-800`, `dark:bg-gray-900`

### Color palette reference

| Purpose                | Light                             | Dark                                        |
| ---------------------- | --------------------------------- | ------------------------------------------- |
| Background page        | `bg-gray-50`                      | `dark:bg-gray-950`                          |
| Card background        | `bg-white`                        | `dark:bg-gray-900`                          |
| Card border            | `border-gray-200`                 | `dark:border-gray-700`                      |
| Primary text           | `text-gray-900`                   | `dark:text-gray-100`                        |
| Secondary text         | `text-gray-500`                   | `dark:text-gray-400`                        |
| Accent (green default) | `text-green-600` / `bg-green-600` | `dark:text-green-400` / `dark:bg-green-600` |

### Accent color system

- CSS custom property `--color-accent` set on `<html>` by `DarkModeContext`
- Used sparingly — most interactive elements use green-600 as default

### Density

- `.density-compact` class on `<html>` toggles tighter spacing
- Use `density-padding`, `density-gap`, `density-text` classes in elements that should respond to density

### Responsive patterns

- Sidebar: `lg:translate-x-0` (fixed on desktop, overlay on mobile)
- Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Padding: `p-4 md:p-6 lg:p-8`
- Spaces: `space-y-6 md:space-y-8`

---

## 11. Imports Convention

Order imports in this sequence (separated by blank lines):

1. React / library imports (react, react-router-dom, lucide-react, recharts)
2. Context hooks (`../../context/XxxContext`)
3. UI components (`../../components/ui/Xxx`)
4. Feature components (`../components/Xxx`)
5. Hooks (`../../hooks/useXxx`)
6. Utilities / data (`../../utils/units`, `../../data/demoData`)
7. Types (`../../types`)

```ts
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Footprints, Flame } from "lucide-react";

import { useLogs } from "../../../context/LogsContext";
import { useProfile } from "../../../context/ProfileContext";

import Card from "../../../components/ui/Card";
import PageHeader from "../../../components/ui/PageHeader";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

import { useActivityStreak } from "../../../hooks/useActivityStreak";
import { useUnitConversion } from "../../../hooks/useUnitConversion";

import { activityLevels } from "../../../utils/units";

import type { UserProfile } from "../../../types";
```

---

## 12. Error & Loading States

Every page that consumes async context must handle:

```ts
if (loading) return <LoadingSpinner />
if (error) return <div className="text-red-500">{error}</div>
if (!data) return null  // or <EmptyState />
```

Use `<EmptyState Icon={X} title="..." subtitle="..." />` for empty lists/views.
Use `<LoadingSpinner />` for full-page loading.
Use `<ConfirmModal>` for destructive action confirmations.

---

## 13. Icon Usage

- All icons from `lucide-react` — import individual icons by name
- Use the `Icon` prop pattern for dynamic icons in shared components:

```ts
interface Props {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
}
```

---

## 14. Code You Should NOT Write

```ts
// ❌ No 'any'
const data: any = getData()

// ❌ No @ts-ignore
// @ts-ignore

// ❌ No inline styles (use Tailwind classes)
<div style={{ color: 'red' }} />

// ❌ No comments explaining obvious code
// increment counter by 1
count += 1

// ❌ No default exports for hooks
export default function useForm()

// ❌ No nested ternaries in JSX
{condition ? a ? b : c : d}
```

---

## 15. Git & Commits

- Follow conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:`
- One commit per logical change
- No force pushes, no `--no-verify` flag
- Before committing: review `git status`, `git diff`, and `git log --oneline -10`
- Keep the commit history linear and readable

---

## 16. Quick Reference

| Pattern              | File                                         | Key Takeaway                                                     |
| -------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| Context + useReducer | `src/context/LogsContext.tsx`                | `SET_DATA`, `SET_LOADING`, `SET_ERROR` + guard hook              |
| UI component         | `src/components/ui/Card.tsx`                 | `interface Props`, default export, no side effects               |
| Page component       | `src/features/dashboard/pages/Dashboard.tsx` | Consume contexts, handle loading, return null for missing data   |
| Form management      | `src/hooks/useForm.ts`                       | `useForm<T>()` with deep path `updateForm(path, value)`          |
| Tab architecture     | `src/features/profile/pages/Profile.tsx`     | Parent manages form state, children receive callbacks            |
| API layer            | `src/services/api.ts`                        | `async`, `delay()`, `deepClone()`, typed returns                 |
| Styling              | `src/index.css`                              | Tailwind v4 with `@import "tailwindcss"`, `@custom-variant dark` |
| Local storage        | `src/hooks/useLocalStorage.ts`               | Generic hook for any serializable value                          |

deploy: On Vercel (frontend)

Set Root Directory to / (repo root) or wherever your existing src/, package.json, vite.config.ts already live — no change needed there since the frontend isn't moving.
Optional but nice: add an Ignored Build Step so Vercel doesn't rebuild the frontend when you only push backend changes. Vercel supports a command like git diff --quiet HEAD^ HEAD ./src ./package.json to skip builds when nothing under those paths changed.

On Render (backend)

When creating the service, set Root Directory to backend/. Render will run its build/start commands from inside that folder, ignoring the rest of the repo.
Same idea in reverse — Render only rebuilds when files under backend/ change (this is automatic based on root directory, no extra config needed).

One thing to plan for either way: CORS. Your frontend (your-app.vercel.app) and backend (your-app.onrender.com) will be on different domains, so your Spring Boot app needs a CORS config allowing your Vercel domain — otherwise the browser will block API calls. I'll make sure that's in the generated project.

Other than those two config steps, backend/ living alongside your existing frontend causes zero conflicts — each platform just looks at its own subfolder and ignores the rest.

Q: Which build tool for Spring Boot?
A: Gradle (Kotlin DSL) - Natural fit for Kotlin project
Q: How should the monorepo be structured?
A: Keep frontend as-is, add backend/ folder - Simplest: backend lives in a new folder alongside the existing frontend
Q: How should auth work on the backend?
A: JWT-based auth - Login returns JWT, frontend sends Bearer token
Q: How should the DB schema be managed?
A: JPA/Hibernate auto-schema - Entities auto-generate tables, simplest setup
Q: Which Kotlin data access approach?
A: Spring Data JPA with Hibernate - Standard, repositories auto-implemented

Plan: Spring Boot Kotlin Backend for FitMonitor
TL;DR — Add a backend/ folder with a Spring Boot 3 + Kotlin + Gradle (Kotlin DSL) project. JPA entities mirror the TypeScript types, REST endpoints replicate the current api.ts mock API, JWT auth replaces the mock token, and the frontend api.ts is updated to call the real backend. Database: Neon (PostgreSQL). Deploy: Render.

Phase 1 — Project Scaffolding
Create backend/ with Gradle wrapper + build.gradle.kts (Spring Boot 3.4, Kotlin 2.1, Java 21, JJWT, PostgreSQL, Jackson Kotlin)
application.yml / application-dev.yml / application-prod.yml — DB, JPA, JWT, CORS config
Dockerfile for Render deployment
Phase 2 — JPA Entities (11 entities)
User, UserProfile, DailyLog, Meal, Workout, Exercise, ExerciseSet, Suggestion, ConnectedDevice, GoalHistoryEntry, ActiveSession, BlockedUser
All mirror the TypeScript types from types
Phase 3 — DTOs & Mappers
Request DTOs: LoginRequest, SignupRequest, ProfileUpdateRequest, etc.
Response DTOs: AuthResponse, DailyLogResponse, ProfileResponse, etc.
Extension functions for Entity ↔ DTO mapping
Phase 4 — Repository Layer
6+ Spring Data JPA repositories with custom query methods
Phase 5 — Security Layer
JwtTokenProvider — generate/validate JWT via JJWT
JwtAuthenticationFilter — extract Bearer token
SecurityConfig — permit auth endpoints, protect everything else, CORS, stateless sessions

Phase 6 — Service Layer
AuthService, LogService, ProfileService, WorkoutService, MealService, SuggestionService
Phase 7 — REST Controllers
AuthController (/api/auth), LogController (/api/logs), ProfileController (/api/profile), WorkoutController (/api/workouts), MealController (/api/meals), SuggestionController (/api/suggestions)
Phase 8 — Seed Data
DataInitializer (CommandLineRunner) — seeds demo user, 21 days of logs, 6 suggestions — same data as demoData.ts
Phase 9 — Frontend Integration
Update api.ts to call real backend with fetch() + Bearer token
Add VITE_API_URL env variable
Phase 10 — Deployment Config
Dockerfile for Render
render.yaml or documented manual setup
Root package.json convenience scripts
Key Decisions
Decision Choice
Monorepo Frontend stays at root, backend/ folder added
Build tool Gradle with Kotlin DSL
Auth JWT with Bearer tokens
DB schema JPA/Hibernate ddl-auto=update
ORM Spring Data JPA
Database PostgreSQL via Neon (DATABASE_URL env var)
Deploy Render (Dockerfile)
Seed data CommandLineRunner — same data as demoData.ts
Verification
./gradlew bootRun — app starts on port 8080
POST /api/auth/login with demo credentials → returns JWT
GET /api/logs with Bearer token → 21 days of logs
Frontend npm run dev → logs in, shows dashboard with real data
./gradlew test → all tests pass
Docker build succeeds

##########

Now I want to add the backend. I want a monorepo. Create a Spring Boot project for the backend, using Kotlin. The database will be Neon, and I'll deploy it on Render.

Q: Which build tool for Spring Boot?
A: Gradle (Kotlin DSL) - Natural fit for Kotlin project
Q: How should the monorepo be structured?
A: Keep frontend as-is, add backend/ folder - Simplest: backend lives in a new folder alongside the existing frontend
Q: How should auth work on the backend?
A: JWT-based auth - Login returns JWT, frontend sends Bearer token
Q: How should the DB schema be managed?
A: JPA/Hibernate auto-schema - Entities auto-generate tables, simplest setup
Q: Which Kotlin data access approach?
A: Spring Data JPA with Hibernate - Standard, repositories auto-implemented

Plan: Spring Boot Kotlin Backend for FitMonitor
TL;DR — Add a backend/ folder with a Spring Boot 3 + Kotlin + Gradle (Kotlin DSL) project. JPA entities mirror the TypeScript types, REST endpoints replicate the current api.ts mock API, JWT auth replaces the mock token, and the frontend api.ts is updated to call the real backend. Database: Neon (PostgreSQL). Deploy: Render.

Phase 1 — Project Scaffolding
Create backend/ with Gradle wrapper + build.gradle.kts (Spring Boot 3.4, Kotlin 2.1, Java 21, JJWT, PostgreSQL, Jackson Kotlin)
application.yml / application-dev.yml / application-prod.yml — DB, JPA, JWT, CORS config
Dockerfile for Render deployment
Phase 2 — JPA Entities (11 entities)
User, UserProfile, DailyLog, Meal, Workout, Exercise, ExerciseSet, Suggestion, ConnectedDevice, GoalHistoryEntry, ActiveSession, BlockedUser
All mirror the TypeScript types from types
Phase 3 — DTOs & Mappers
Request DTOs: LoginRequest, SignupRequest, ProfileUpdateRequest, etc.
Response DTOs: AuthResponse, DailyLogResponse, ProfileResponse, etc.
Extension functions for Entity ↔ DTO mapping

API endpoints for Profile & Settings

Grouped by tab, matching your existing frontend types.

Personal Info

GET /api/profile → full UserProfile (used on page load)
PATCH /api/profile/personal → update name, age, height, weight, goalWeight, unitSystem, activityLevel, timezone, bio
POST /api/profile/avatar → multipart upload, returns { avatarUrl }
DELETE /api/profile/avatar → remove avatar, revert to initial fallback

Goals

GET /api/profile/goals → current goals + macros + targetDate/targetWeight
PATCH /api/profile/goals → update goals
GET /api/profile/goals/history → paginated GoalHistoryEntry list

Notifications

GET /api/profile/notifications
PATCH /api/profile/notifications → whole NotificationPrefs object (simplest: one PATCH, since it saves as one unit in your UI)

Privacy

GET /api/profile/privacy
PATCH /api/profile/privacy → showOnLeaderboard, sharedMetrics, allowFriendRequests

GET /api/profile/privacy/sessions
DELETE /api/profile/privacy/sessions/{sessionId} → sign out one session

GET /api/profile/privacy/blocked-users
DELETE /api/profile/privacy/blocked-users/{userId} → unblock

Devices

GET /api/profile/devices
PATCH /api/profile/devices/{deviceId}/connect
PATCH /api/profile/devices
Claude’s response was interrupted.

You give me a list for api for Profile & Settings . what api i have to make. also tell me how BE code base will be structure, the architecture, readablity, clear code base. it for my new fitmonitor app. i have provide to .md file for details

Orchestrated comprehensive API and architecture guidance for fitness app backend
Orchestrated comprehensive API and architecture guidance for fitness app backend
APIs for Profile & Settings

Grouped by tab, matching your existing UserProfile types from the .md files.

Personal Info

GET /api/profile → full UserProfile (page load)
PATCH /api/profile/personal → name, age, height, weight, goalWeight, unitSystem, activityLevel, timezone, bio
POST /api/profile/avatar → multipart upload → { avatarUrl }
DELETE /api/profile/avatar → remove, revert to initial-letter fallback

Goals

GET /api/profile/goals
PATCH /api/profile/goals → macros, targetDate, targetWeight, bodyFatPercent, restingHR, workoutsPerWeek
GET /api/profile/goals/history → paginated GoalHistoryEntry[]

Notifications

GET /api/profile/notifications
PATCH /api/profile/notifications → whole NotificationPrefs object, saved as one unit (matches your single "Save" button)

Privacy

GET /api/profile/privacy
PATCH /api/profile/privacy → showOnLeaderboard, sharedMetrics, allowFriendRequests

GET /api/profile/privacy/sessions
DELETE /api/profile/privacy/sessions/{sessionId} → sign out one session

GET /api/profile/privacy/blocked-users
DELETE /api/profile/privacy/blocked-users/{userId}

Devices

GET /api/profile/devices
PATCH /api/profile/devices/{deviceId}/connect
PATCH /api/profile/devices/{deviceId}/disconnect
POST /api/profile/devices/{deviceId}/sync → updates lastSynced to now
PATCH /api/profile/devices/{deviceId}/sync-frequency

Appearance

GET /api/profile/appearance
PATCH /api/profile/appearance → theme, accentColor, density, widgetOrder

Quick stats & danger zone

GET /api/profile/stats → BMI, weightToGoal, activityStreak, totalLoggedDays, workoutDays
DELETE /api/profile → delete account (requires re-auth or confirm flag in body)

One design decision worth naming: each tab gets its own GET/PATCH pair rather than one giant PATCH /api/profile for everything. It mirrors your frontend exactly — each tab has its own "Save" button and independent state — and keeps request payloads small and each service method focused on one concern.
