# FitMonitor — Code Structure & Architecture

## Stack
- **React 19** + **TypeScript** (strict)
- **Vite 8** (bundler, dev server)
- **Tailwind CSS v4** (utility-first styling)
- **React Router v7** (client-side routing)
- **Recharts** (charts)
- **Lucide React** (icons)

## Directory Layout

```
src/
├── types/              # Shared TypeScript type definitions
│   ├── logs.ts         # DailyLog, Meal, Workout, Exercise, ExerciseSet
│   ├── profile.ts      # UserProfile, Goals, NotificationPrefs, etc.
│   ├── auth.ts         # User, AuthSession
│   ├── suggestions.ts  # Suggestion
│   ├── contexts.ts     # Context value types + action unions
│   └── index.ts        # Barrel re-exports
│
├── context/            # React Context providers (global state)
│   ├── AuthContext.tsx       # Auth state + methods (login, signup, logout)
│   ├── DarkModeContext.tsx   # Theme, accent color, density
│   ├── LogsContext.tsx       # Daily log entries (useReducer)
│   ├── ProfileContext.tsx    # User profile data (useReducer)
│   └── SuggestionsContext.tsx# Daily suggestions (useReducer)
│
├── services/
│   └── api.ts          # Mock API layer (async, delay-simulated)
│
├── data/
│   └── demoData.ts     # Hardcoded demo data + generator functions
│
├── utils/
│   └── units.ts        # Unit conversion helpers (kg↔lb, cm↔in) + constants
│
├── hooks/
│   ├── useForm.ts              # Deep path-based form state management
│   ├── useLocalStorage.ts      # Generic localStorage get/set with JSON
│   ├── useActivityStreak.ts    # Compute consecutive workout-day streak
│   └── useUnitConversion.ts    # Weight/height formatting bound to unit system
│
├── components/
│   └── ui/             # Shared presentational components
│       ├── AvatarUpload.tsx        # Profile avatar with file input
│       ├── Card.tsx                # Section wrapper with padding + shadow
│       ├── ChannelCheckboxes.tsx    # Multi-select channel toggles
│       ├── ColorSwatchPicker.tsx    # Accent color selector
│       ├── ConfirmModal.tsx         # Destructive action confirmation
│       ├── EmptyState.tsx           # Empty list placeholder
│       ├── FormInput.tsx            # Label + input wrapper
│       ├── LoadingSpinner.tsx       # Full-page spinner
│       ├── MetricCheckboxGroup.tsx  # Tag-style metric checkboxes
│       ├── PageHeader.tsx           # Page title + subtitle
│       ├── ProgressRing.tsx         # SVG circular progress
│       ├── ReorderableList.tsx      # Up/down arrow reorder
│       ├── SectionHeader.tsx        # Icon + title section heading
│       ├── Select.tsx               # Label + select dropdown
│       ├── StatCard.tsx             # Metric card for dashboard
│       ├── TabButton.tsx            # Tab toggle button
│       ├── TimePicker.tsx           # Time input wrapper
│       └── Toggle.tsx               # Switch toggle
│
├── features/           # Feature-sliced modules (page + components)
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── Landing.tsx         # Marketing / login landing
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── ResetPassword.tsx
│   │   └── components/
│   │       ├── LoginForm.tsx
│   │       ├── SignupForm.tsx
│   │       └── ProtectedRoute.tsx  # Auth gate wrapper
│   │
│   ├── dashboard/
│   │   └── pages/
│   │       └── Dashboard.tsx       # Overview: stat cards + progress rings
│   │
│   ├── workouts/
│   │   └── pages/
│   │       └── WorkoutLog.tsx      # Workout day grid + exercise lists
│   │
│   ├── meals/
│   │   └── pages/
│   │       └── MealsDiet.tsx       # Meal log + suggestions
│   │
│   ├── progress/
│   │   ├── pages/
│   │   │   └── Progress.tsx        # Chart grid
│   │   └── components/
│   │       ├── WeightChart.tsx
│   │       ├── CalorieChart.tsx
│   │       ├── StepsChart.tsx
│   │       └── SleepChart.tsx
│   │
│   ├── history/
│   │   └── pages/
│   │       └── History.tsx         # Calendar heatmap + day detail
│   │
│   ├── profile/
│   │   ├── pages/
│   │   │   └── Profile.tsx         # Tab shell with 6 tabs
│   │   └── components/
│   │       ├── PersonalTab.tsx
│   │       ├── GoalsTab.tsx
│   │       ├── NotificationsTab.tsx
│   │       ├── PrivacyTab.tsx
│   │       ├── DevicesTab.tsx
│   │       └── AppearanceTab.tsx
│   │
│   └── layout/
│       └── components/
│           ├── Layout.tsx      # App shell (Sidebar + Header + <Outlet>)
│           ├── Header.tsx      # Top bar with user info + theme toggle
│           └── Sidebar.tsx     # Navigation sidebar
│
├── App.tsx             # Route definitions + provider nesting
├── main.tsx            # Entry point (ReactDOM.createRoot)
└── vite-env.d.ts       # Vite client types reference
```

## Data Flow

```
App.tsx
  └─ DarkModeProvider       — theme, accent, density (useLocalStorage)
    └─ AuthProvider         — user session (useLocalStorage)
      └─ LogsProvider       — daily logs (useReducer, fetches api.getDailyLogs)
        └─ ProfileProvider  — user profile (useReducer, fetches api.getUserProfile)
          └─ SuggestionsProvider — suggestions (useReducer, fetches api.getSuggestions)
            └─ AppRoutes
              └─ Layout
                  ├─ Header (reads ProfileContext)
                  ├─ Sidebar (reads AuthContext)
                  └─ Page (reads relevant contexts)
```

Each provider loads its data independently on mount. Pages only consume the contexts they need, so unrelated data updates don't trigger re-renders.

## Key Patterns

### Contexts
All follow `createContext<Type | null>(null)` + guard in the consumer hook:

```ts
const Ctx = createContext<Value | null>(null)
export function useValue() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('...')
  return ctx
}
```

Reducer-based contexts (Logs, Profile, Suggestions) use discriminated union actions:

```ts
type Action =
  | { type: 'SET_LOGS'; payload: DailyLog[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
```

### API Layer
All functions in `src/services/api.ts` are async with a simulated `delay()`. They deep-clone data from `demoData.ts` to prevent mutation leaks. Returns are typed via `src/types/`.

### Forms
Profile uses `useForm(initialData)` which returns `{ form, setForm, updateForm(path, value), resetForm }`. `updateForm` supports dot-separated paths for nested fields (e.g., `'goals.macros.protein'`).

### Profile Tab Architecture
`Profile.tsx` renders a tab bar and conditionally renders one of 6 tab components. All tabs receive the same shared props: `{ form, updateForm, handleSaveForm }` and read from context directly when needed.

### TypeScript
- Strict mode enabled
- No `any` or `@ts-ignore` usage
- All component props defined via `interface Props`
- Recharts types provided by recharts package (no `@types/recharts` needed)

## Data Types (core entities)

| Type | Key fields | Source |
|---|---|---|
| `UserProfile` | name, age, height, weight, goals, notificationPrefs, privacySettings, appearance | `demoData.ts` |
| `DailyLog` | date, steps, calories, sleep, water, weight, meals[], workouts[] | `demoData.ts` |
| `Meal` | name, type (breakfast/lunch/dinner/snack), macros | `demoData.ts` |
| `Workout` | exercises[] + sets[] with reps/weight/duration | `demoData.ts` |
| `Suggestion` | title, description, icon name | `demoData.ts` |
| `User` | id, name, email | `demoData.ts` |

## Cross-cutting Concerns

- **Unit system** (`metric` / `imperial`): stored in `UserProfile.unitSystem`; formatting via `useUnitConversion` hook; affects Dashboard stats, Header weight display, and Profile inputs.
- **Dark mode**: `DarkModeContext` syncs theme class to `<html>`, listens for system preference changes when in `'smart'` mode.
- **Accent color + density**: applied as CSS custom properties (`--color-accent`, `density-compact` class) on `<html>` via `DarkModeContext`.
