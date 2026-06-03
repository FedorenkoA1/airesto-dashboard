# Airesto Dashboard

Restaurant reservation grid built for the Airesto test task.

## Live Demo
[your-vercel-url-here]

## Tech Stack
- Vue 3 + Vite + TypeScript
- Tailwind CSS v4
- Element Plus
- Pinia
- date-fns / date-fns-tz

## Features
- Reservation grid with sticky headers (tables top, time left)
- All event types: orders (New/Bill/Closed/Banquet) and reservations
- Overlap and intersection layout algorithm
- Hover effect with glass blur
- Date switching (5 available days)
- Zone filter toggle (1 этаж / 2 этаж / Банкетный зал)
- Restaurant timezone clock (not local time)
- Dark/light theme toggle

## Bonus Features
- Dark/light theme switching
- Responsive column widths via CSS variables

## Project Structure
src/
└── features/
└── reservationGrid/
├── components/    ← UI only, no business logic
├── composables/   ← reusable logic (time, layout algorithm)
├── store/         ← global state (Pinia)
├── types/         ← TypeScript contracts
├── data/          ← mock API data
├── services/      ← API layer (ready for real backend)
└── eventLayout/   ← overlap/intersection algorithm

Here we use feature based architecture
## Why Feature-Based Architecture

Instead of grouping files by type (all components together, all stores together),
we group by feature — everything related to the reservation grid lives in one folder.

**Benefits:**
- Delete one folder = delete one feature. No hunting across the codebase.
- Clear boundaries — each feature has its own components, store, types, and logic.
- Scales well — adding a new feature means adding a new folder, nothing else changes.
- Public API via `index.ts` — internal implementation details stay hidden.

This mirrors how large Vue/React codebases are structured in production teams.