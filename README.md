# Family Watchlist

A collaborative web application for families to manage shared lists of movies and TV shows. Track what you want to watch, what you're watching, and rate what you've seen.

## Features

- **Personal Watchlist** - Add movies and TV shows to your personal watchlist
- **TMDB Integration** - Search for titles with auto-filled posters, descriptions, and metadata
- **Status Tracking** - Mark items as "Want to Watch", "Watching", or "Watched"
- **Ratings** - Rate watched items on a 1-10 scale
- **Family Groups** - Create or join a family group with invite codes
- **Privacy Control** - Mark items as private to hide them from family members
- **Random Picker** - Can't decide what to watch? Let the app pick randomly from your list or your family's combined list
- **Filtering & Sorting** - Filter by type (Movie/TV) and status, sort alphabetically or by date added

## Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- TMDB API integration

### Frontend
- React 19
- Vite
- React Router v7
- Axios

## Screenshots

The app features a responsive poster grid layout:

- Movie and TV show posters displayed in a clean grid
- Privacy and type badges overlaid on posters
- Quick status and rating controls
- Expandable descriptions

## Setup

### Prerequisites
- Node.js 18+
- MongoDB instance
- TMDB API key (free at https://www.themoviedb.org/settings/api)

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values
```

Required environment variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/watchlist
JWT_SECRET=your-secret-key
TMDB_API_KEY=your-tmdb-api-key
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the App

### Development

Run both frontend and backend together:
```bash
cd frontend
npm run dev:all
```

Or run them separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The frontend runs on http://localhost:5173 and proxies API requests to the backend on port 5000.

### Production Build

```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Watchlist
- `GET /api/watchlist` - Get user's watchlist (filterable by type/status)
- `POST /api/watchlist` - Add item
- `PATCH /api/watchlist/:id` - Update item (status, rating, privacy)
- `DELETE /api/watchlist/:id` - Delete item
- `GET /api/watchlist/random` - Get random pick

### Family
- `POST /api/family` - Create family group
- `GET /api/family` - Get family group details
- `POST /api/family/join` - Join with invite code
- `POST /api/family/leave` - Leave group
- `GET /api/family/watchlist` - Get family's combined watchlist

### TMDB
- `GET /api/tmdb/search` - Search movies/TV shows
- `GET /api/tmdb/settings` - Check TMDB configuration status

## License

MIT
