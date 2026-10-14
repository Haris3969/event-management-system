# Event Management System

React app for exploring events from the Ticketmaster Discovery API, registering for them, and managing registrations.

## Tech
- React 18 (Vite)
- Redux Toolkit
- React Router v6
- Ticketmaster Discovery API v2

## Features
- Register / login / logout (frontend simulation, persisted in Local Storage)
- Browse upcoming events, search by keyword, filter by category, city and date
- Event details page (date, venue, location, category, image, price, link)
- Register for / cancel an event (duplicates prevented, per-user)
- My Events with upcoming and completed sections
- Protected routes, loading and error states, form validation, responsive layout

## Setup
1. Get a free API key (Consumer Key) from https://developer.ticketmaster.com/
2. Clone the repo and install dependencies:
   ```
   git clone <repo-url>
   cd event-management-system
   npm install
   ```
3. Create a `.env` file in the project root (copy `.env.example`) and add your key:
   ```
   VITE_TICKETMASTER_API_KEY=your_api_key_here
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Open the URL printed in the terminal (usually http://localhost:5173).

Production build: `npm run build`

## Project structure
```
src/
  api/          Ticketmaster requests and response mapping
  app/          Redux store
  components/   Navbar, EventCard, ProtectedRoute
  features/     Redux slices (auth, events, registrations)
  pages/        Login, Register, Events, EventDetails, MyEvents
  utils/        Local Storage helper
```

## Notes
- Authentication is simulated on the frontend; users are stored in Local Storage and no real backend is used.
- The `.env` file is git-ignored and must not be committed.
