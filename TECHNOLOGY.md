# FitMonitor — Technology Stack

## Frontend Framework
- **React 19** with Vite 8 build tool

## Routing
- **React Router DOM v7** — client-side navigation between 6 pages

## Styling
- **Tailwind CSS v4** — utility-first CSS framework via @tailwindcss/vite

## Charts & Visualization
- **Recharts** — responsive charts (line, bar, area) for weight, calories, steps, sleep

## Icons
- **Lucide React** — consistent icon set across the UI

## State Management
- **React Context + useReducer** — lightweight global state (swappable for Redux/Zustand later)

## Project Structure
- Components organized into `layout/`, `ui/`, `charts/`
- Pages in `pages/`
- Mock data layer in `services/api.js` — ready for backend replacement

## Packages
```
react, react-dom, react-router-dom, recharts, lucide-react
tailwindcss, @tailwindcss/vite, @vitejs/plugin-react, vite
```
