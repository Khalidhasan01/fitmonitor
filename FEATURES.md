# FitMonitor — Features

## Pages & Routes

| Route              | Page               | Access    | Description                                                                                                             |
| ------------------ | ------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/`                | Landing            | Public    | Hero section + toggleable login/signup forms. Shows demo credentials                                                    |
| `/forgot-password` | Forgot Password    | Public    | Email input -> sends reset link                                                                                         |
| `/reset-password`  | Reset Password     | Public    | New password form with token support                                                                                    |
| `/dashboard`       | Dashboard          | Protected | Summary cards (steps, calories, heart rate, sleep, water, weight) + daily progress rings + suggestions + latest workout |
| `/workouts`        | Workout Log        | Protected | Browse workout days, filter by muscle group, expand to see sets/reps/weights                                            |
| `/meals`           | Meals & Diet       | Protected | Today's meals (breakfast/lunch/dinner/snack) with macros, nutrition summary, and fitness suggestions                    |
| `/progress`        | Progress & Charts  | Protected | 4 interactive charts — weight trend, calories burned vs consumed, daily steps, sleep hours                              |
| `/history`         | History            | Protected | Month calendar with color-coded step activity, click a date to see that day's details                                   |
| `/profile`         | Profile & Settings | Protected | Tabbed interface: Personal, Goals, Notifications, Privacy, Devices, Appearance + quick stats + delete account           |

---

## 1. Authentication System

### Landing Page (`/`)
A split-screen marketing landing page with a hero section on the left and authentication forms on the right. The hero displays the app logo ("FitMonitor" with an Activity icon), a tagline ("Your Complete Fitness Companion"), three feature highlights (Workouts, Health, Progress), and demo credentials. The right panel features a pill-toggle between "Sign In" and "Sign Up" tabs. Background uses a subtle gradient with floating decorative shapes.

### Login Form
- Email and password inputs with icon prefixes (Mail, Lock) and show/hide password toggle (Eye/EyeOff)
- "Remember me" checkbox and "Forgot password?" link
- Client-side validation for empty fields — red border and error text on blur
- Loading spinner on submit button during async call (button text replaced with spinner icon)
- Error display banner for invalid credentials — red card with X icon, slides in from top
- Success redirects to `/dashboard` on success with a brief loading state
- Pre-filled demo credentials shown as placeholders in inputs
- Keyboard support: Enter key submits form, Tab navigates between fields
- Form state: idle → validating → submitting → success/error

### Signup Form
- Full name, email, password, and confirm password fields with icon prefixes
- Password visibility toggle per password field
- Validation rules:
  - All fields required — inline error messages
  - Password minimum 6 characters — live feedback on change
  - Passwords must match — confirm field shows red border + "Passwords don't match" on mismatch
  - Email format validation via regex — inline error for invalid format
- Confirm password field: live comparison as user types, green checkmark when matching
- Error handling for duplicate email accounts — red banner "Email already registered"
- On success: auto-login and redirect to dashboard
- Terms hint: subtle "By signing up, you agree to our Terms" text below the button

### Forgot Password (`/forgot-password`)
- Email input with Mail icon, sends reset link
- Three states:
  - **Form state**: email input field + "Send Reset Link" button
  - **Success state**: green checkmark animation (CSS scale-in + fade), "Check your email" message, "Try again" button
  - **Error state**: red banner for unregistered email
- Loading spinner on submit while processing
- Back link to sign in page (`/`) with arrow icon
- Returns to login after success via the back link

### Reset Password (`/reset-password`)
- Reads `token` from URL search params (supports mock token — accepts any non-empty string)
- New password + confirm password fields with show/hide toggle
- Matching validation: confirm field highlights red on mismatch
- Password strength indicator: minimum 6 characters (red → green when met)
- Three states:
  - **Form state**: both password fields + "Reset Password" button
  - **Success state**: green checkmark animation, "Password Reset!" heading, button to navigate to sign in
  - **Error state**: red banner for failures
- Loading spinner on submit, error handling throughout

### Protected Routes
- `ProtectedRoute` component wraps all authenticated pages
- Uses `useAuth().isAuthenticated` — checks for valid session with token
- Unauthenticated access: redirects to `/` with location tracking (`state.from` preserved via `useLocation`)
- After login, navigates back to original destination URL if `state.from` exists
- Returns children when authenticated (no wrapper styling)

### Session Management
- Auth session stored in localStorage via `useLocalStorage<AuthSession>` under key `fitmonitor_auth`
- Session type: `{ user: User, token: string }`
- Token: mock JWT string (`mock-jwt-token-{timestamp}`)
- Session is read on every protected route mount via context
- Logout: clears localStorage key, navigates to `/`, resets all data contexts
- Delete account: removes user from demo users array, clears session, navigates to landing
- Auth context exposes: `user`, `isAuthenticated`, `login()`, `signup()`, `logout()`, `deleteAccount()`

---

## 2. Layout & Navigation

### Sidebar
- Dark-themed fixed sidebar (`w-64`, `bg-gray-900`, `min-h-screen`)
- FitMonitor branding at top: Activity icon + "FitMonitor" text, green accent
- User info section: avatar initial circle (first letter of name), name, email (truncated with ellipsis)
- 6 navigation links using React Router `NavLink`:
  - Dashboard (LayoutDashboard icon), Workouts (Dumbbell), Meals & Diet (Apple), Progress (BarChart3), History (Calendar), Profile (Settings)
- Active link: green background (`bg-green-600/20`) + green left border accent (`border-l-4 border-green-500`), white text
- Inactive link: gray text (`text-gray-400`), hover background (`hover:bg-gray-800`)
- Mobile behavior:
  - Hidden by default on `< lg:` screens
  - Slides in as overlay with backdrop (semi-transparent black, click to close)
  - Fixed position, `z-40`, transition `translate-x` animation
  - Controlled by `sidebarOpen` state from Layout, toggled via Header hamburger
- Responsive: `fixed` positioning on all screens, visible on `lg:` (`lg:translate-x-0`)

### Header
- Sticky top bar with white/dark background, bottom border
- Left section:
  - User greeting: "Welcome back, {firstName}" (extracts first word from `user.name`)
  - Today's date formatted as "Thursday, July 24" using `toLocaleDateString('en-US', ...)`
- Right section (flex, gap-4):
  - Weight display: current weight vs goal weight (e.g., "76.5 → 72 kg"), hidden on small screens (`hidden lg:flex`), respects unit system from profile
  - Theme toggle cycle button: Light (Sun) → Dark (Moon) → Smart (Monitor) using `DarkModeContext`
  - Sign Out button: LogOut icon, `text-gray-600`, hover red, with confirmation via ConfirmModal (alert modal "Are you sure?")
- Mobile: hamburger menu button (Menu icon) visible only on `lg:hidden`, toggles `sidebarOpen`
- Height: `h-16`

### Layout Shell
- Wraps all protected pages: `<Sidebar /> + <Header /> + <main>` in a flex container
- Desktop layout: sidebar fixed left, header + main offset with `ml-64`
- Mobile layout: sidebar hidden (overlay), header + main full width
- Main content area responsive padding: `p-4 md:p-6 lg:p-8`
- Main content has `min-h-[calc(100vh-4rem)]` to fill remaining viewport
- Handles mobile menu overlay: backdrop click to close sidebar
- Unauthenticated users: renders children directly without sidebar/header (no shell)
- Scroll behavior: main area scrolls independently, sidebar and header fixed

---

## 3. Dashboard (`/dashboard`)

### Overview
Main overview page displaying daily fitness metrics at a glance. Data sourced from the latest `DailyLog` entry via `LogsContext`, combined with `ProfileContext` for goals and `SuggestionsContext`.

### Stat Cards Grid
4-column responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), gap-4:
8 interactive `StatCard` components:

| Card | Icon | Color | Data Source | Behavior |
|------|------|-------|-------------|----------|
| Steps Today | Footprints | Blue | Latest log `steps` vs `dailyStepGoal` | Shows "X / Y steps", percentage subtext |
| Calories Burned | Flame | Orange | Latest log `caloriesBurned` vs `dailyCalorieGoal` | "X of Y cal", progress fraction |
| Heart Rate | Heart | Red | Latest log `heartRateAvg` | "X bpm", static label "Avg resting" |
| Sleep | Moon | Purple | Latest log `sleepHours` vs `sleepGoal` | "Xh / Yh", "hours" label |
| Water | Droplets | Teal | Latest log `waterCups` vs `waterGoal` | "X / Y cups", hydration progress |
| Weight | Weight | Green | Latest log `weight` (with unit conversion) | "X kg → Y kg", "Current → Goal" |
| Calories Eaten | Apple | Pink | Latest log `caloriesConsumed` vs `caloriesBurned` | "X cal", "Net: ±Z" computed value |
| Workouts | TrendingUp | Indigo | Total workouts across all logs + active days count | "X workouts / Y days" |

Each card: icon in colored circle (`w-10 h-10 rounded-full flex items-center justify-center`), label (`text-sm text-gray-500`), large value with unit (`text-2xl font-bold`), subtext (`text-xs text-gray-400`). Hover: slight lift effect (`hover:shadow-md` transition).

### Daily Progress Rings
5 `ProgressRing` SVG components in a flex row (justify-center, gap-6):
- Rings for: Steps, Calories, Sleep, Water, Weight Goal
- Each ring: 60px diameter SVG, circular stroke with `strokeDasharray`/`strokeDashoffset`, configurable color per metric
- Center label: percentage (e.g., "85%"), subtitle below ring (e.g., "Steps")
- Stroke width: 6px, background stroke: light gray
- Animation: rings animate on mount using CSS transition on `strokeDashoffset`
- Percentage capped at 100% visually

### Data Loading States
- **Loading**: LoadingSpinner centered in the content area
- **Error**: Error banner with red background, error message, and "Retry" button
- **Empty**: Gray info card "No data yet" with stats icon, shown when no logs exist or log is empty
- Skeleton UI: stat cards show pulsing gray placeholder while data loads

### Suggestions Panel
- Section header: Lightbulb icon + "Suggestions" heading
- 4 suggestion cards from `SuggestionsContext`, fetched on mount
- Each card: green icon circle, title (font-semibold), description (text-sm text-gray-500)
- Grid: `grid-cols-1 md:grid-cols-2` layout

### Latest Workout Card
- Section header: "Today's Workout" or "Latest Workout"
- If today has workouts in the latest log:
  - Card with workout date
  - Exercise list: name, muscle group badge (colored pill), sets summary
  - Each exercise: "name — muscleGroup: X sets"
- If no workout: "No workout logged today" with Dumbbell icon, muted styling
- Empty state: "No workouts yet" with suggestion to log one

---

## 4. Workout Log (`/workouts`)

### Overview
Browse all workout days in reverse chronological order. Each day can have one or more workouts with exercises, sets, reps, and weights. Data comes from `LogsContext`.

### Page Header
- "Workout Log" title with `PageHeader` component (large text, bold)
- Subtitle: "Track your strength training progress"
- "Log Workout" button (green, with Plus icon) — placeholder for future functionality, shows a toast/info alert "Workout logging coming soon"

### Data States
- **Loading**: LoadingSpinner centered
- **Error**: Error card with red background, message, retry button
- **Empty**: `EmptyState` component with Dumbbell icon, "No workouts logged yet", subtitle "Start tracking your workouts to see them here"
- Empty sub-filter state: "No workouts match this filter" when muscle group filter yields no results

### Muscle Group Filter
- Dynamic filter chips generated from all unique `muscleGroup` values across all exercises in all workouts
- First chip: "All" (always present, default active)
- Additional chips: each unique muscle group name (e.g., "Chest", "Back", "Legs")
- Active chip: green background (`bg-green-600 text-white`)
- Inactive chip: gray ghost (`bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300`)
- Clicking a chip filters visible workout cards to only those containing exercises in that muscle group
- Chips wrap in a flex row with gap

### Workout Day Cards
- Accordion-style cards, reverse chronological order
- Each card:
  - **Header** (clickable, `cursor-pointer`): date formatted as "Monday, Jan 15" via `toLocaleDateString`, exercise count ("X exercises"), total set count ("Y sets"), chevron icon (ChevronDown rotates 180° when expanded)
  - **Body** (conditional on expand): show/hide with `max-h` transition animation (0 → 500px, duration-300)
- No workout for a given date: the card still appears if there's a workout entry but with empty exercise list, shows "No exercises" message

### Expanded Exercise View
Each exercise within a workout:
- Header row: exercise name (bold), muscle group badge (colored pill — color varies by muscle group, predefined map or fallback gray)
- Table: `w-full` with header row and set rows
  - Headers: "Set", "Reps / Duration", "Weight / Distance"
  - Rows: set number, reps value (or duration in minutes with "min" suffix), weight in kg (or dash if null)
- Sets sorted by `setNumber` (mapIndexed to ensure sequential display 1, 2, 3...)
- Alternating row backgrounds for readability

---

## 5. Meals & Diet (`/meals`)

### Overview
View today's meals and nutrition data. Data sourced from the latest DailyLog's meals array from `LogsContext`.

### Tab Navigation
Two-tab interface using `TabButton`:
- "Today's Meals" (default active) — Apple icon
- "Suggestions" — Lightbulb icon
- Active tab: green filled background, inactive: gray outline

### Data States
- **Loading**: LoadingSpinner
- **Error**: Error card with retry
- **Empty meals**: "No meals logged today" with Cookie icon, muted styling
- **Empty suggestions**: Fallback to "No suggestions available"

### Daily Nutrition Summary
- Card with `StatCard`-like metrics in a 2x2 grid
- Four metrics:
  - **Calories** (blue Flame icon): total `caloriesConsumed` from all meals summed, shown as large number with "cal" label
  - **Protein** (red icon): sum of all meal `protein` values, shown as "Xg" with "Protein" label
  - **Carbs** (yellow icon): sum of all meal `carbs` values, "Xg" label
  - **Fat** (orange icon): sum of all meal `fat` values, "Xg" label

### Meal Cards
- 2-column grid of meal cards (`grid-cols-1 md:grid-cols-2`)
- Each meal card:
  - Type-specific icon: Sunrise (breakfast), Sun (lunch), Moon (dinner), Cookie (snack)
  - Type-specific color theme: orange/yellow/indigo/pink border accent
  - Meal name (bold)
  - Calorie count ("X cal")
  - Macro breakdown in a row: "P: Xg | C: Xg | F: Xg" with colored labels
- Cards sorted by type order: breakfast, lunch, dinner, snack

### Suggestions Tab
- Grid of suggestion cards from `SuggestionsContext`
- Each card: Lightbulb icon, title, description
- Special "Quick Tip" gradient card (green-to-teal) at the bottom:
  - Shows dynamic protein advice based on today's total protein intake
  - "Protein Tip: Try to reach Xg of protein today" with contextual message
- 2-column responsive grid

---

## 6. Progress & Charts (`/progress`)

### Overview
4 interactive charts in a 2x2 responsive grid (`grid-cols-1 lg:grid-cols-2`), all powered by Recharts. Data from all daily logs in `LogsContext`.

### Data States
- **Loading**: LoadingSpinner
- **Error**: Error card with retry
- **Empty**: "Not enough data to display charts" message, "Log your first workout or meal to see progress"

### Weight Trend (LineChart)
- Recharts `LineChart` inside `ResponsiveContainer` (width=100%, height=300)
- X-axis: dates, formatted as "Jan 15" via `tickFormatter`
- Y-axis: weight range, auto domain `[dataMin - 1, dataMax + 1]` with `allowDecimals`
- Line: green (`#16a34a`), monotone curve (`type="monotone"`), strokeWidth 2
- Dots: `dot={{ r: 4 }}`, active dot with highlight radius 6
- Tooltip: white/dark background, full date and weight in kg, label "Weight"
- Grid lines: dashed, light gray
- Dark mode: axis text and grid lines adapt

### Calories: Burned vs Consumed (BarChart)
- `BarChart` with `ResponsiveContainer`, height 300
- X-axis: dates as "Jan 15"
- Y-axis: calorie range
- Two grouped bars per day: `barSize={20}` with `gap`
- Orange bar (`#f97316`): burned calories
- Green bar (`#16a34a`): consumed calories
- Rounded top corners via `radius={[4, 4, 0, 0]}`
- Legend at top: orange "Burned" + green "Consumed", vertical layout
- Tooltip: shows both values for selected day
- Dark mode: legend and tooltip styled for dark bg

### Daily Steps (AreaChart)
- `AreaChart`, height 300
- Blue area with gradient fill (defined in SVG `defs`: top blue, bottom transparent)
- Line: monotone curve, blue, strokeWidth 2
- Dots: blue, active dot with ring
- Tooltip: formatted step count with locale (`toLocaleString('en-US')`)

### Sleep Hours (BarChart)
- `BarChart`, height 300
- X-axis: dates
- Y-axis: fixed domain 0–10, ticks at 0, 2, 4, 6, 8, 10
- Single purple bar per day (`#9333ea`)
- Tooltip: "Sleep: X hours"
- Grid, axis, and styling consistent with other charts

---

## 7. History (`/history`)

### Overview
Monthly calendar view with color-coded step activity. Click a day to see detailed metrics. Data from all daily logs in `LogsContext`.

### Data States
- **Loading**: LoadingSpinner
- **Error**: Error card with retry
- **Empty month**: All gray cells, no data tooltip on hover

### Calendar Navigation
- Header row: left/right arrow buttons (ChevronLeft / ChevronRight), month/year title (e.g., "July 2026")
- Navigation logic:
  - Previous month: always enabled, decrements month, handles year wrap
  - Next month: disabled if target month is current month or in the future (prevent navigating past today)
  - Month formatting: `toLocaleDateString('en-US', { month: 'long', year: 'numeric' })`
- Arrow buttons: circular, hover background, disabled state opacity

### Calendar Grid
- 7-column grid (`grid-cols-7`) with day-of-week headers: Sun, Mon, Tue, Wed, Thu, Fri, Sat
- First-day offset: empty cells before day 1 using `firstDayOfMonth.getDay()` (0=Sunday)
- Each day cell: square aspect ratio (`aspect-ratio: 1`), clickable button
- 5-level color coding by step percentage of `dailyStepGoal`:
  | Level | Range | Color | Description |
  |-------|-------|-------|-------------|
  | 0% | No data | Gray-200 dark:gray-700 | No log for this date |
  | 1–25% | `<=25%` | Green-200 | Minimal activity |
  | 26–50% | `<=50%` | Green-300 | Light activity |
  | 51–75% | `<=75%` | Green-400 | Moderate activity |
  | 76–100% | `<=100%` | Green-500 | Goal reached |
- Selected day: ring highlight (`ring-2 ring-green-600 ring-offset-2`)
- Hover: slight scale-up effect
- Disabled future days: muted, not clickable

### Day Detail Panel
- Slides in below calendar when a date is selected
- Full date header: "Monday, January 15, 2024"
- 4 metric cards in a 4-column grid:
  - Steps (Footprints, blue): large step count with locale formatting
  - Calories (Flame, orange): burned value
  - Sleep (Moon, purple): hours with 1 decimal
  - Workouts (Dumbbell, indigo): count of workouts that day
- Each card: colored icon circle, large value, label
- Workout highlights section:
  - "Workouts" subheading
  - Exercise name pills: gray background (`bg-gray-200 dark:bg-gray-700`), rounded, text-sm
  - If no workouts: "No workouts on this day" muted text
- Unselected state: placeholder text "Select a date to view details"

---

## 8. Profile & Settings (`/profile`)

### Overview
Full user profile management with 6 tabbed sections. Two-column layout: sidebar tabs on left (1/4 width), content on right (3/4 width). Data sourced from `ProfileContext`.

### States
- **Loading**: LoadingSpinner
- **Error**: Error card with retry
- **Save success**: brief green success toast/message after save
- **Save error**: red error banner with message
- **Form dirty tracking**: save button disabled when no changes made

### Layout
- Two-column responsive layout: `grid-cols-1 lg:grid-cols-4`
- Left column (`lg:col-span-1`): tab navigation sidebar + quick stats + motivation card
- Right column (`lg:col-span-3`): active tab content

### Tab Navigation (Sidebar)
6 vertical tab buttons with icons, `w-full`:
| Tab | Icon | Component |
|-----|------|-----------|
| Personal | User | User info, avatar, bio, measurements |
| Goals | Target | Daily goals, macros, target date, history |
| Notifications | Bell | Toggle channels, quiet hours |
| Privacy | Shield | Sharing, sessions, blocked users |
| Devices | Smartphone | Connected device management |
| Appearance | Palette | Theme, accent, density, widget order |
- Active tab: green background (`bg-green-600/20 text-green-700`), left border
- Inactive: hover highlight, text-gray-700
- Click switches content without navigation (controlled state)

### Quick Stats Sidebar
- Card below tab navigation with labeled metrics:
  - **BMI**: `weight / ((height / 100) * (height / 100))`, 1 decimal place, "Normal" category label
  - **Weight to Goal**: `weight - goalWeight` formatted as "X.X kg to go" (or negative if above)
  - **Activity Streak**: consecutive workout days count from logs, flame icon (orange if ≥3, gray otherwise)
  - **Total Logged Days**: count of all daily log entries
  - **Workout Days**: count of days with at least one workout

### Motivation Card
- Gradient card (green-to-teal, `bg-gradient-to-br from-green-500 to-teal-600`)
- White text, fitness quote (static or cycling), Quote icon
- "Stay consistent, every rep counts" (example)
- Rounded corners, padding, subtle shadow

### Personal Tab
Two modes: **View** (default) and **Edit** (toggle).

**View Mode:**
- Avatar: circular image (`w-24 h-24`), `<img>` if `avatarUrl` exists, otherwise initial letter fallback (first letter of name, white on green gradient background)
- Name and age heading: "Alex, 28"
- 3-column metric cards: Height (Ruler icon, cm), Current Weight (Weight icon, kg), Goal Weight (Target icon, kg)
- 3-column info cards: Activity Level (with description), Timezone (IANA name), Unit System (Metric/Imperial)
- Bio: displayed in a styled block, italic, `text-gray-600`, empty state shows "No bio yet" muted

**Edit Mode:**
- Toggle via Edit/Cancel button pair (pencil icon on Edit, X icon on Cancel)
- Avatar upload: Camera button overlay on avatar, hidden `<input type="file" accept="image/*">`, reads as base64 data URL via `FileReader`, preview updates immediately
- Form fields:
  - Name: text input with User icon
  - Age: number input, min 1, max 150
  - Height: number input, step 0.1, unit label "cm"
  - Weight: number input, step 0.1, unit label "kg"
  - Goal Weight: number input, step 0.1, unit label "kg"
  - Unit System: dropdown (Metric / Imperial)
  - Activity Level: dropdown (5 levels: Sedentary/Light/Moderate/Active/Very Active with descriptions)
  - Timezone: dropdown populated from `Intl.supportedValuesOf('timeZone')`, sorted alphabetically, with fallback array
  - Bio: textarea, max 500 characters, live character counter (e.g., "42/500"), red when approaching limit
- Save button: green, with Save icon, disabled when no changes or invalid
- Validation: all number fields required, positive, within ranges

### Goals Tab
- Section header: "Daily Goals" with Target icon

**Daily Goals Display:**
- 4 stat cards in a grid: Steps (Footprints, blue), Calories (Flame, orange), Water (Droplets, teal), Sleep (Moon, purple)
- Each shows current goal value (from profile)

**Macro Targets:**
- 3 editable number inputs in a row: Protein (g), Carbs (g), Fat (g)
- Each with food-related icon, unit label "g"
- Live total: "Total: Xg" below the inputs

**Target Date & Weight:**
- Date picker input (date type) + target weight number input
- Computed weekly rate shown in green info box:
  - Example: "Lose 0.5 kg/week over 12 weeks"
  - Formula: `(currentWeight - targetWeight) / weeksBetweenDates`
  - Hidden if no target date or target weight set

**Additional Goals:**
- Body Fat %: number input with percentage unit
- Resting HR: number input with "bpm" label
- Workouts/Week: number input, min 0, max 14

**Goal History:**
- Scrollable container (`max-h-60 overflow-y-auto`)
- List of `GoalHistoryEntry` items, sorted newest first
- Each entry:
  - Status icon: green CheckCircle (hit=true) or red XCircle (hit=false)
  - "Weight" or "Workouts" label
  - Date formatted
  - "achieved X / target Y" text
- Empty state: "No goal history yet"

**Save button:** green, disabled until changes made.

### Notifications Tab
- Section with 5 notification toggles, each in a styled flex row

**Notification Types:**
| Type | Icon | Extra Fields |
|------|------|--------------|
| Email Notifications | Mail | channel checkboxes (Push, Email) |
| Workout Reminders | Dumbbell | channels + time picker (HH:MM) |
| Meal Reminders | Apple | channels + time picker |
| Weekly Reports | BarChart3 | channel checkboxes |
| Streak-at-Risk Alert | Zap | channel checkboxes |

- Each row: label with icon, toggle switch on the right
- When toggled ON: row expands to reveal channels (as pill checkboxes using `ChannelCheckboxes`) and optional time picker
- Channel options: Push (Bell), Email (Mail), SMS (MessageSquare) — color coded

**Quiet Hours:**
- Separate section below
- Toggle with moon icon
- When enabled: two time pickers (start, end) separated by a dash
- Example: "22:00 – 07:00"
- Only visible when parent toggle is ON

**Save button** — green, disabled when unchanged.

### Privacy Tab
- **Show on Leaderboard**: single toggle with Users icon and description
- **Share Progress**: `MetricCheckboxGroup` with 5 options:
  - Steps (Footprints), Weight (Weight), Workouts (Dumbbell), Meals (Apple), Heart Rate (Heart)
  - Selected state: purple border + checkmark
  - Each with its own icon and label
- **Allow Friend Requests**: single toggle with UserPlus icon
- **Active Sessions**: list of session cards:
  - Device name, "Current device" badge (green, `bg-green-100 text-green-800`), location (if any), last active timestamp formatted relative ("Just now", "Xm ago", "Xh ago")
  - Non-current sessions: "Sign Out" button (red, text-sm), removes session on click
  - Empty state: "No active sessions"
- **Blocked Users**: list with avatar initial, name, blocked timestamp
  - Red X button to unblock (removes from list)
  - Empty state: "No blocked users"
- **Save button**: green, disabled when unchanged

### Devices Tab
- List of connected device cards, each with:
  - Device name (bold)
  - Type icon: Watch (watch), Activity (tracker), Heart (health_platform)
  - Connect/Disconnect toggle button:
    - Disconnected: green "Connect" button
    - Connected: red outlined "Disconnect" button
  - Connected devices: expand inline with:
    - Last synced: relative timestamp ("Just now", "Xm ago", or formatted time)
    - "Sync now" button (updates lastSynced to current time, shows brief "Synced!" feedback)
    - Sync frequency dropdown: Real-time / Hourly / Daily (options from `syncFrequencyOptions`)
- 6 pre-seeded demo devices: Apple Watch, Fitbit Charge 6, Garmin Forerunner, Apple Health, Google Fit, Strava
- **Save button**: green, disabled when unchanged

### Appearance Tab
- **Theme**: 3 selection cards in a row:
  - Light (Sun icon), Dark (Moon icon), System/Smart (Monitor icon)
  - Each card: icon, name, description text
  - Active card: green border ring, slight lift shadow
  - Inactive: gray border, hover effect

- **Accent Color**: 5 circular color swatches in a row:
  - Green, Blue, Purple, Orange, Teal
  - Selected: outer ring highlight (`ring-2 ring-offset-2` in accent color), white checkmark icon
  - Unselected: gray border, hover scale

- **Density**: 2 selection cards:
  - Comfortable (description: "More spacing, easier to read")
  - Compact (description: "Tighter spacing, more information")
  - Active: green border
  - Inactive: gray border

- **Dashboard Widget Order**: `ReorderableList` component:
  - Ordered list of widget names: Steps, Calories, Heart Rate, Sleep, Water, Weight, Meals, Workouts
  - Each item: GripVertical icon (drag handle, currently visual only), item name, up/down arrow buttons
  - Up button disabled at first position, down disabled at last position
  - Reorder triggers state update, displayed in new order

- **Save button**: syncs theme/accent/density to `DarkModeContext`, persists to localStorage

### Danger Zone: Delete Account
- Red-bordered card, always visible below active tab content
- Trash2 icon, "Delete Account" heading, warning text
- "Delete Account" button (red, outlined) → opens `ConfirmModal`
- Modal: alert icon, "Delete Account?" title, "This action is permanent and irreversible." message
- Cancel button (gray) + "Delete Forever" button (red)
- On confirm: calls `deleteAccount()` from Auth context, clears profile state, navigates to `/`

---

## 9. Shared UI Components

### Card
Flexible container: `bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700`, optional `p-4 md:p-6` default padding, `className` prop for extension.

### StatCard
Props: `{ icon: LucideIcon, label: string, value: string | number, subtext?: string, color: CardColor }`. Renders icon in colored circle (`w-10 h-10`), label (text-sm), value (text-2xl font-bold), subtext (text-xs). 8 color variants: blue, green, orange, purple, red, teal, pink, indigo — each maps to Tailwind `bg-{color}-100 text-{color}-600` for icon circle, `text-{color}-600` for value.

### PageHeader
Props: `{ title: string, subtitle?: string }`. Large bold title (`text-2xl md:text-3xl font-bold`), optional gray subtitle below.

### SectionHeader
Props: `{ icon: LucideIcon, title: string, color?: SectionColor }`. Icon in colored circle (`w-8 h-8`) + title in `text-lg font-semibold`. 10 color variants.

### ProgressRing
Props: `{ size?: number, strokeWidth?: number, progress: number, color?: string, label?: string }`. SVG circular progress: background circle stroke gray-200, progress circle stroke color, `strokeDasharray`/`strokeDashoffset` for percentage. Center text: percentage, subtitle below. Animation: CSS transition on mount.

### FormInput
Props: `{ label: string, error?: string } & React.InputHTMLAttributes`. Label above, styled input with `focus:ring-2 focus:ring-green-500`, border, dark mode support, red border on error + error text below.

### Select
Props: `{ label: string, options: { value: string, label: string }[], error?: string }`. Dropdown with styled select element, label, dark mode.

### Toggle
Hidden checkbox peer (`sr-only peer`), styled as sliding knob: `w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-600`, knob circle (`w-5 h-5 bg-white rounded-full`), CSS `peer-checked:translate-x-full` transition.

### TabButton
Props: `{ active: boolean, onClick: () => void, children }`. Pill button: active = `bg-green-600 text-white`, inactive = `bg-gray-100 text-gray-600 hover:bg-gray-200`.

### TimePicker
Props: `{ label: string, value: string, onChange: (v: string) => void }`. Input `type="time"` with label, consistent styling with FormInput.

### ChannelCheckboxes
Props: `{ channels: string[], onChange: (channels: string[]) => void }`. Pill-style checkboxes for Push (Bell), Email (Mail), SMS (MessageSquare). Selected: green border + green bg, unselected: gray.

### MetricCheckboxGroup
Props: `{ options: Array<{ value: string, label: string, icon: LucideIcon }>, selected: string[], onChange: (selected: string[]) => void }`. Tag-style multi-select checkboxes with icons, purple selected state.

### ColorSwatchPicker
Props: `{ colors: Array<{ value: string, color: string }>, selected: string, onChange: (v: string) => void }`. Circular swatches (`w-8 h-8 rounded-full`), white checkmark on selected, outer ring highlight.

### ReorderableList
Props: `{ items: string[], onReorder: (items: string[]) => void }`. List with GripVertical icon per item, up/down arrow buttons. Disabled up at index 0, disabled down at last index.

### ConfirmModal
Props: `{ isOpen: boolean, title: string, message: string, confirmLabel?: string, confirmVariant?: 'red' | 'orange', onConfirm: () => void, onCancel: () => void }`. Modal overlay with backdrop, alert icon, title, message, Cancel (gray) + Confirm (red/orange) buttons.

### AvatarUpload
Props: `{ imageUrl: string | null, name: string, onUpload: (dataUrl: string) => void }`. Circular display: `<img>` or initial fallback (`w-24 h-24 rounded-full`). Camera button overlay on hover (`opacity-0 hover:opacity-100`), file input.

### LoadingSpinner
Full-page centered (`fixed inset-0 flex items-center justify-center`), animated spinning circle (`animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent`).

### EmptyState
Props: `{ icon: LucideIcon, title: string, subtitle?: string }`. Centered column: large icon (gray, `w-16 h-16`), title (`text-xl font-semibold`), subtitle (`text-gray-500`).

---

## 10. Application Shell

### Provider Architecture
```
App.tsx
  └─ BrowserRouter
    └─ DarkModeProvider    — theme, accent, density via useLocalStorage
      └─ AuthProvider      — user session via useLocalStorage
        └─ LogsProvider    — daily logs via useReducer, fetches api.getDailyLogs
          └─ ProfileProvider  — user profile via useReducer, fetches api.getUserProfile
            └─ SuggestionsProvider — suggestions via useReducer, fetches api.getSuggestions
              └─ AppRoutes
```

### Provider Pattern (each context)
- `createContext<Type | null>(null)` — nullable initial value
- Guard hook: `useXxx()` throws `"useXxx must be used within XxxProvider"` if context is null
- Data contexts (`LogsProvider`, `ProfileProvider`, `SuggestionsProvider`):
  - `useReducer` with discriminated union actions: `SET_DATA`, `SET_LOADING`, `SET_ERROR`
  - State shape: `{ data: T | null, loading: boolean, error: string | null }`
  - Fetch on mount via `useEffect` with `.then/.catch/.finally` chain
  - Provides: data, loading, error, refresh function, update dispatch

### Auth Context
- `useLocalStorage<AuthSession | null>('fitmonitor_auth', null)`
- Exposes: `user`, `isAuthenticated`, `login()`, `signup()`, `logout()`, `deleteAccount()`
- Login: validates against demo users array, creates mock token, stores in localStorage
- Signup: adds to demo users array, creates mock token, stores in localStorage
- Logout: clears localStorage, resets state
- Delete account: filters from demo users, clears localStorage

### API Layer (`src/services/api.ts`)
- All functions are async with simulated `delay()` (200ms default, 300ms for auth)
- Data functions deep-clone with `JSON.parse(JSON.stringify())` to prevent mutation
- `updateUserProfile`: `Object.assign(userProfile, deepClone(updates))`
- Auth functions validate against `demoUsers` array (stored in module-level variable)
- Password stripped from returned user objects via `const { password: _, ...safeUser }`
- Error simulation: `catch` blocks with custom error messages for edge cases

---

## 11. Cross-Cutting Features

### Unit System (Metric / Imperial)
- Stored in `profile.unitSystem` field
- Utilities in `src/utils/units.ts`:
  - `kgToLb(kg)`, `lbToKg(lb)`, `cmToIn(cm)`, `inToCm(in)`
  - `cmToFtIn(cm)` → `{ ft: number, inches: number }`
  - `formatWeight(kg, system)` — returns "75 kg" or "165.3 lb"
  - `formatHeight(cm, system)` — returns "175 cm" or "5'9\""
  - `formatWeightValue(kg, system)` — numeric value only (for inputs)
  - `formatWeightUnit(system)`, `formatHeightUnit(system)` — unit labels
  - `estimateMaintenanceCalories(weightKg, activityLevel)` — multiplier table (sedentary=1.2, light=1.375, moderate=1.55, active=1.725, very_active=1.9)
  - `timezones` array from `Intl.supportedValuesOf('timeZone')` with static fallback
  - `activityLevels` array: value/label/description for each level
  - `syncFrequencyOptions`: realtime, hourly, daily with labels
- Consumed by: Header (weight display), Dashboard (weight stat), Profile (quick stats, personal tab)
- `useUnitConversion(unitSystem?)` hook: returns memoized `formatWeight`, `formatHeight` functions

### Dark Mode
- 3 modes: Light, Dark, System (smart)
- System mode: listens to `prefers-color-scheme` media query (`matchMedia`), updates in real time
- `DarkModeContext`: manages `theme`, `accent`, `density` state
- Applies `.dark` class on `<html>` element for Tailwind dark variant
- Applies accent CSS custom properties (`--color-accent`, `--color-accent-hover`) on `<html>`
- Toggle access: Header theme icon (desktop cycle button), Profile Appearance tab (card selection)
- Persisted in localStorage: `fitmonitor_theme`, `fitmonitor_accent`, `fitmonitor_density`
- Charts: grid lines use dark-adapted color, axis text white in dark mode, tooltip dark bg
- Every component uses `dark:` Tailwind variants for bg, text, border, shadow

### Accent Color
- 5 presets: Green (`#16a34a`, default), Blue (`#2563eb`), Purple (`#9333ea`), Orange (`#ea580c`), Teal (`#0d9488`)
- Applied as CSS custom properties: `--color-accent` (base) and `--color-accent-hover` (darker variant)
- `applyAccent()` in DarkModeContext: uses color map + `adjustColor()` helper to compute hover variant (darkens by 10%)
- Selected in Profile Appearance tab via `ColorSwatchPicker`

### Density Mode
- Comfortable (default) vs Compact
- Compact: toggles `density-compact` class on `<html>`
- CSS classes in `index.css`: `.density-compact .density-padding` (reduced padding), `.density-gap` (reduced gap), `.density-text` (smaller text)
- Applied via Tailwind: components add `density-padding`, `density-gap`, `density-text` className
- Compact reduces: card padding (p-4→p-2), gaps (gap-6→gap-3), font sizes

### Widget Order
- Stored in `appearance.widgetOrder[]` — array of 8 widget key strings
- `ReorderableList` in Appearance tab: up/down arrow reorder
- Dashboard reads this array to control widget rendering order (reorder prop, rendering respects order)

---

## 12. Data Model

### Core Entity: User
```ts
interface User {
  id: string
  name: string
  email: string
}
```
- `id`: UUID string, generated by backend (`@UuidGenerator`)
- `name`: full name string
- `email`: unique (DB constraint), used for login

### Core Entity: DailyLog
```ts
interface DailyLog {
  date: string              // 'YYYY-MM-DD'
  steps: number
  caloriesBurned: number
  caloriesConsumed: number
  heartRateAvg: number
  sleepHours: number
  waterCups: number
  weight: number
  meals: Meal[]
  workouts: Workout[]
}
```
- One log per user per date (not enforced in mock, but via `findByUserIdAndDate` in backend)
- `weight`: daily logged weight (can differ from profile weight)

### Core Entity: Meal
```ts
interface Meal {
  id: string
  name: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  calories: number
  protein: number
  carbs: number
  fat: number
}
```
- Linked to parent `DailyLog` via `dailyLogId` foreign key
- `type` stored as String in backend (not enum — `@Column(nullable=false)`)

### Core Entity: Workout & Exercise
```ts
interface ExerciseSet {
  set: number
  reps: number | null
  weight: number | null
  duration: number | null
}

interface Exercise {
  name: string
  muscleGroup: string
  sets: ExerciseSet[]
}

interface Workout {
  id: string
  date: string
  exercises: Exercise[]
}
```
- Workout linked to `DailyLog` via `dailyLogId`
- Exercise linked to `Workout` via `workoutId`
- ExerciseSet linked to `Exercise` via `exerciseId`
- Cascade: All — deleting a DailyLog cascades to meals, workouts, exercises, sets
- `setNumber` column for ordering, display uses `sortedBy { it.setNumber }.mapIndexed`

### Core Entity: UserProfile (extended)
```ts
interface UserProfile {
  name: string
  age: number
  height: number             // cm
  weight: number             // kg
  goalWeight: number
  dailyStepGoal: number
  dailyCalorieGoal: number
  waterGoal: number          // cups
  sleepGoal: number          // hours
  avatarUrl: string | null   // base64 data URL
  unitSystem: 'metric' | 'imperial'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  timezone: string           // IANA timezone, e.g. 'America/New_York'
  bio: string                // max 500 chars
  goals: Goals
  notificationPrefs: NotificationPrefs
  privacySettings: PrivacySettings
  connectedDevices: ConnectedDevice[]
  appearance: Appearance
}
```
- One-to-one with User: `@OneToOne(mappedBy = "profile")` on User side
- Stored as JSON columns in PostgreSQL for nested objects (goalsJson, notificationPrefsJson, etc.)
- Mapped via Jackson `ObjectMapper` + custom `TypeReference` in `ProfileMapper.kt`

### Nested: Goals
```ts
interface Goals {
  macros: { protein: number; carbs: number; fat: number }
  targetDate: string | null   // 'YYYY-MM-DD'
  targetWeight: number
  bodyFatPercent: number | null
  restingHR: number | null    // bpm
  workoutsPerWeek: number
  history: GoalHistoryEntry[]
}

interface GoalHistoryEntry {
  date: string
  type: 'weight' | 'workouts'
  target: number
  achieved: number
  hit: boolean
}
```

### Nested: NotificationPrefs
```ts
interface NotificationSetting {
  enabled: boolean
  channels: ('push' | 'email' | 'sms')[]
}

interface NotificationPrefs {
  emailNotifications: NotificationSetting
  workoutReminders: NotificationSetting & { time: string }
  mealReminders: NotificationSetting & { time: string }
  weeklyReports: NotificationSetting
  streakAtRisk: NotificationSetting
  quietHours: { start: string; end: string; enabled: boolean }
}
```

### Nested: PrivacySettings
```ts
interface BlockedUser { id: string; name: string; blockedAt: string }
interface ActiveSession { id: string; device: string; location: string; lastActive: string; current: boolean }

interface PrivacySettings {
  showOnLeaderboard: boolean
  sharedMetrics: ('steps' | 'weight' | 'workouts' | 'meals' | 'heartRate')[]
  allowFriendRequests: boolean
  blockedUsers: BlockedUser[]
  activeSessions: ActiveSession[]
}
```

### Nested: ConnectedDevice
```ts
interface ConnectedDevice {
  id: string
  name: string
  type: 'watch' | 'tracker' | 'health_platform'
  connected: boolean
  lastSynced: string | null   // ISO datetime
  syncFrequency: 'realtime' | 'hourly' | 'daily'
}
```

### Nested: Appearance
```ts
interface Appearance {
  theme: 'light' | 'dark' | 'smart'
  accentColor: 'green' | 'blue' | 'purple' | 'orange' | 'teal'
  density: 'comfortable' | 'compact'
  widgetOrder: string[]
}
```

### Entity Relationships
```
User (auth/entity)
  └─ UserProfile (profile/entity)           @OneToOne
  └─ DailyLog[] (logs/entity)               @OneToMany
    └─ Meal[]                               @OneToMany
    └─ Workout[]                             @OneToMany
      └─ Exercise[]                          @OneToMany
        └─ ExerciseSet[]                     @OneToMany
  └─ Suggestion[] (suggestions/entity)       @OneToMany
```

### Backend Package Structure (package-by-feature)
```
com.fitmonitor/
├── common/            — ApiResponse, MessageResponse, exceptions, configs (CORS, Security, JWT), seed/DataInitializer
├── auth/              — AuthController, AuthService, UserEntity, UserRepository, AuthDTOs, AuthMapper
├── profile/           — 7 controllers (Profile, Goals, Notifications, Privacy, Devices, Appearance, Stats),
│                         7 services, UserProfileEntity, UserProfileRepository, 8 DTO files, ProfileMapper
├── logs/              — 3 controllers (Log, Workout, Meal), 3 services,
│                         5 entities (DailyLog, Meal, Workout, Exercise, ExerciseSet),
│                         3 repositories, LogDTOs, LogMapper
└── suggestions/       — SuggestionController, SuggestionService, SuggestionEntity, SuggestionRepository, SuggestionDTOs, SuggestionMapper
```

### Backend API Endpoints

**Auth (`/api/auth`)**:
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user (name, email, password) |
| POST | `/api/auth/login` | Login (email, password) → JWT token |
| POST | `/api/auth/forgot-password` | Send reset link |
| POST | `/api/auth/reset-password` | Reset password with token |

**Profile (`/api/profile`)**:
| Method | Path | Controller |
|--------|------|------------|
| GET | `/api/profile` | ProfileController |
| PUT | `/api/profile` | ProfileController (bulk update) |
| PATCH | `/api/profile/personal` | ProfileController |
| POST | `/api/profile/avatar` | ProfileController (multipart upload) |
| DELETE | `/api/profile/avatar` | ProfileController |
| DELETE | `/api/profile` | ProfileController (delete account) |
| PATCH | `/api/profile/goals` | GoalsController |
| GET | `/api/profile/goals/history` | GoalsController (paginated) |
| PATCH | `/api/profile/notifications` | NotificationsController |
| PATCH | `/api/profile/privacy` | PrivacyController |
| GET | `/api/profile/privacy/sessions` | PrivacyController |
| DELETE | `/api/profile/privacy/sessions/{sessionId}` | PrivacyController |
| GET | `/api/profile/privacy/blocked-users` | PrivacyController |
| DELETE | `/api/profile/privacy/blocked-users/{blockedUserId}` | PrivacyController |
| PATCH | `/api/profile/devices` | DevicesController (bulk) |
| GET | `/api/profile/devices` | DevicesController |
| PATCH | `/api/profile/devices/{deviceId}/connect` | DevicesController |
| PATCH | `/api/profile/devices/{deviceId}/disconnect` | DevicesController |
| POST | `/api/profile/devices/{deviceId}/sync` | DevicesController |
| PATCH | `/api/profile/devices/{deviceId}/sync-frequency` | DevicesController |
| PATCH | `/api/profile/appearance` | AppearanceController |
| GET | `/api/profile/stats` | StatsController |

**Logs (`/api/logs`, `/api/workouts`, `/api/meals`)**:
| Method | Path | Controller |
|--------|------|------------|
| GET | `/api/logs` | LogController |
| GET | `/api/logs/latest` | LogController |
| GET | `/api/logs/{date}` | LogController |
| GET | `/api/workouts` | WorkoutController (optional start/end query params) |
| GET | `/api/meals/{date}` | MealController |

**Suggestions (`/api/suggestions`)**:
| Method | Path | Controller |
|--------|------|------------|
| GET | `/api/suggestions` | SuggestionController |

---

## 13. Demo Data

- **1 demo user**: `demo@fitmonitor.com` / `password123`, name "Alex Johnson"
- **21 days** of generated fitness data with realistic sinusoidal weight fluctuation, random step counts (5k–15k), varied workout patterns (every 2 out of 3 days)
- **27 exercises** across 4 muscle groups: Chest (Bench Press), Back (Pull Ups), Legs (Squat), Shoulders (Overhead Press)
- **4 meals per day**: oatmeal (breakfast), chicken salad (lunch), salmon with rice (dinner), mixed nuts (snack) — 84 total meal entries
- **6 connected devices**: Apple Watch (connected), Fitbit Charge 6, Garmin Forerunner, Apple Health, Google Fit, Strava (disconnected defaults)
- **6 fitness suggestions**: Stay Hydrated, Mix Up Cardio, Protein Timing, Sleep Matters, Track Meals, Warm Up Properly
- **3 goal history entries**: weight targets (hit), workout target (missed)
- **2 active sessions**: current (Chrome/macOS) + previous (Safari/iPhone)
- **Realistic profile defaults**: age 28, 178cm, 76.5kg → 72kg goal, metric system, moderate activity, US/Eastern timezone

---

## 14. Tracked Metrics

| Metric | Unit | Source |
|--------|------|--------|
| Steps | count per day | DailyLog.steps |
| Calories Burned | kcal per day | DailyLog.caloriesBurned |
| Calories Consumed | kcal per day | DailyLog.caloriesConsumed |
| Heart Rate | bpm (resting avg) | DailyLog.heartRateAvg |
| Sleep Hours | hours per night | DailyLog.sleepHours |
| Water Intake | cups per day | DailyLog.waterCups |
| Weight | kg (daily logged) | DailyLog.weight |
| Workouts | count per day | DailyLog.workouts[] |
| Exercises | per workout | Workout.exercises[] |
| Exercise Sets | per exercise | Exercise.sets[] |
| Reps | per set | ExerciseSet.reps (nullable) |
| Weight Lifted | kg per set | ExerciseSet.weight (nullable) |
| Exercise Duration | minutes | ExerciseSet.duration (nullable) |
| Activity Streak | consecutive days | Computed from workouts |
| Macros (P/C/F) | grams per day | Summed from Meal.protein/carbs/fat |
| Body Fat % | optional | Goals.bodyFatPercent |
| Resting HR | bpm optional | Goals.restingHR |
| Daily Goals | steps/calories/water/sleep | UserProfile fields |

---

## 15. Responsive Design

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | <640px | Single column grids, sidebar overlay, hamburger menu, stacked chart layout, compact profile tabs |
| Tablet | 640px+ | 2-column grids, visible weight stats in header, side-by-side charts |
| Desktop | 1024px+ | 4-column grids, fixed sidebar, side-by-side chart pairs, visible profile sidebar |
| Wide | 1280px+ | Extended padding (`lg:p-8`), wider form inputs, max-width containers |

Specific patterns:
- Content padding scales: `p-4` (mobile) → `md:p-6` → `lg:p-8`
- Section spacing: `space-y-6` → `md:space-y-8`
- Sidebar: `w-64` fixed on `lg:`, full-screen overlay with backdrop on mobile
- Grids: `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-4`
- Profile layout: `grid-cols-1 lg:grid-cols-4` (sidebar + content)
- Charts: `ResponsiveContainer` at 100% width, height=300
- Profile tab sidebar: full-width on mobile, fixed 1/4 on desktop
- Forms: `max-w-md` on inputs, `max-w-lg` on textareas

---

## 16. Technical Architecture

### Technology Stack
| Layer | Technology |
|---|---|
| Frontend | React 19 |
| Language | TypeScript (strict mode) |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| Charts | Recharts |
| Icons | Lucide React |
| Linting | oxlint |
| State | React Context + useReducer |
| Backend | Kotlin 2.1 + Spring Boot 3.4 |
| Database | PostgreSQL (prod) / H2 (dev) |
| ORM | JPA / Hibernate |
| Security | Spring Security + JWT (jjwt 0.12) |
| API Docs | SpringDoc OpenAPI (optional) |

### State Management
5 context providers nested in `App.tsx`:
1. `DarkModeProvider` — theme, accent, density (localStorage-persisted via `useLocalStorage`)
2. `AuthProvider` — user session (localStorage-persisted, provides login/signup/logout/deleteAccount)
3. `LogsProvider` — daily logs array (`useReducer`, fetch on mount via `api.getDailyLogs()`)
4. `ProfileProvider` — user profile (`useReducer`, fetch on mount via `api.getUserProfile()`)
5. `SuggestionsProvider` — suggestions array (`useReducer`, fetch on mount via `api.getSuggestions()`)

### Profile Form Pattern
- Profile page uses `useState<UserProfile | null>` for local form state (cloned from context on mount)
- `updateForm(path, value)`: deep-clones with `JSON.parse(JSON.stringify())`, updates specific nested path
- 6 tab components receive form slice and callbacks as props (no child re-render for other tabs)
- Save: dispatches `SET_PROFILE` action to context, syncs appearance to `DarkModeContext`
- Dirty tracking: compare form state to original profile reference (shallow compare enabled by deep clone)

### Key Frontend Files

| File | Purpose |
|---|---|
| `src/App.tsx` | Route definitions + provider nesting |
| `src/main.tsx` | Entry point |
| `src/context/AuthContext.tsx` | Auth provider, session management |
| `src/context/LogsContext.tsx` | Daily logs data context |
| `src/context/ProfileContext.tsx` | User profile data context |
| `src/context/SuggestionsContext.tsx` | Suggestions data context |
| `src/context/DarkModeContext.tsx` | Theme, accent, density state |
| `src/types/index.ts` | All TypeScript type definitions |
| `src/services/api.ts` | Mock API layer with simulated delay |
| `src/data/demoData.ts` | Seed data generation |
| `src/utils/units.ts` | Unit conversion utilities |
| `src/hooks/useLocalStorage.ts` | localStorage state hook |
| `src/hooks/useUnitConversion.ts` | Unit formatting hook |
| `src/hooks/useActivityStreak.ts` | Streak computation hook |
| `src/components/ui/Card.tsx` | Base card component |
| `src/components/ui/StatCard.tsx` | Metric display card |
| `src/components/ui/ProgressRing.tsx` | SVG progress ring |
| `src/features/dashboard/pages/DashboardPage.tsx` | Dashboard page |
| `src/features/workouts/pages/WorkoutsPage.tsx` | Workout log page |
| `src/features/meals/pages/MealsPage.tsx` | Meals & diet page |
| `src/features/progress/pages/ProgressPage.tsx` | Charts page |
| `src/features/history/pages/HistoryPage.tsx` | Calendar history page |
| `src/features/profile/pages/ProfilePage.tsx` | Profile settings page |

### Backend Key Files

| File | Purpose |
|---|---|
| `FitMonitorApplication.kt` | Spring Boot entry point |
| `common/config/SecurityConfig.kt` | Spring Security + CORS + JWT filter chain |
| `common/config/CorsConfig.kt` | CORS configuration |
| `common/security/JwtTokenProvider.kt` | JWT generation and validation |
| `common/security/JwtAuthenticationFilter.kt` | OncePerRequestFilter for JWT |
| `common/security/SecurityUtils.kt` | Utility to extract current user ID from SecurityContext |
| `common/exception/GlobalExceptionHandler.kt` | `@RestControllerAdvice` exception handler |
| `common/seed/DataInitializer.kt` | `CommandLineRunner` seed data |
| `auth/AuthController.kt` | Register, login, forgot/reset password endpoints |
| `auth/AuthService.kt` | Business logic for auth |
| `auth/entity/UserEntity.kt` | User JPA entity |
| `profile/ProfileController.kt` | Profile CRUD endpoints |
| `profile/service/GoalsService.kt` | Goals + history logic |
| `profile/mapper/ProfileMapper.kt` | Jackson JSON mapping for profile nested data |
| `logs/controller/LogController.kt` | Daily log query endpoints |
| `suggestions/controller/SuggestionController.kt` | Suggestion query endpoints |

---

## 17. Future-Proof Design

- **API abstraction**: All data fetched through `src/services/api.ts` — mock now, real backend later with zero component changes (same function signatures)
- **Context encapsulation**: Components consume context hooks, never directly call API — swap data sources without touching UI
- **Auth separation**: Auth context is independent of fitness data contexts — clean separation of concerns
- **Extensible profile model**: Adding fields requires updating types, demo data, and the relevant tab component — no schema migration
- **Typed state**: All context values, reducer actions, and API returns are fully typed in `src/types/`
- **No third-party state library**: Current Context + useReducer pattern can be swapped for Zustand/Redux without changing component interfaces
- **JSON column storage**: Profile nested objects stored as JSON strings in DB — schema changes require no migration for new nested fields
- **Package-by-feature**: Backend organized by domain feature (auth/, profile/, logs/, suggestions/) — adding new features is isolated, no cross-cutting package changes
- **Modular controllers**: Each profile tab has its own controller/service — can be extended, versioned, or deprecated independently
