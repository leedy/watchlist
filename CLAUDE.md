# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Family Watchlist App - a collaborative web application for families to manage shared lists of movies and TV shows. Users can create personal watchlists, join family groups via invite codes, track viewing status, rate watched items, and use a random picker to decide what to watch.

## Development Commands

### Running the Application

```bash
# Run both frontend and backend together (from frontend directory)
cd frontend && npm run dev:all

# Run frontend only (Vite dev server on port 5173)
cd frontend && npm run dev

# Run backend only (Express server on port 5000)
cd backend && npm run dev
```

### Building and Linting

```bash
# Build frontend for production
cd frontend && npm run build

# Lint frontend code
cd frontend && npm run lint

# Preview production build
cd frontend && npm run preview --host
```

## Architecture

### Backend (Express + MongoDB)

- **server.js**: Express app initialization, MongoDB connection, route mounting
- **models/**: Mongoose schemas (User, WatchlistItem, FamilyGroup)
- **routes/**: REST API endpoints (auth, watchlist, family)
- **middleware/auth.js**: JWT verification middleware that injects `req.userId`

API routes are mounted at `/api/auth`, `/api/watchlist`, and `/api/family`.

### Frontend (React + Vite)

- **context/AuthContext.jsx**: Global authentication state, stores JWT in localStorage
- **services/api.js**: Axios instance with automatic JWT injection via interceptors
- **pages/**: Route components (Home, Login, Register, Family)
- **components/**: Reusable UI components (AddItemForm, WatchlistItem)

Vite proxies `/api` requests to the backend at `http://localhost:5000`.

### Data Flow

Protected routes use the auth middleware which verifies JWT and attaches `req.userId`. All watchlist operations are scoped to the authenticated user. Family groups use an 8-character hex invite code for joining.

### Key Models

- **User**: email, password (bcrypt hashed), name, familyGroup reference
- **WatchlistItem**: title, type (movie/tv), status (want_to_watch/watching/watched), rating (1-10), user reference
- **FamilyGroup**: name, owner, members array, inviteCode

## Environment Configuration

Backend requires `.env` file with:
- `PORT` (default 5000)
- `MONGODB_URI` (MongoDB connection string)
- `JWT_SECRET` (secret for signing tokens)
