# Watchlist App Roadmap

## Phase 1: Core Improvements
- [x] Search & filter - Find items by title, filter by type (movie/tv)
- [x] Sorting options - Sort by date added, title
- [x] Duplicate prevention - Prevent adding same title twice
- [ ] Pagination - Handle large watchlists efficiently
- [ ] Input validation - Add server-side validation (Joi/Zod) to prevent bad data

## Phase 2: Enhanced User Experience
- [ ] Edit items - Currently you can only add/delete, not edit details
- [x] Poster images - Integrate with TMDB API to auto-fetch movie/show posters
- [x] Poster grid layout - Display items as a visual poster grid
- [ ] Notes/comments - The model supports notes but UI doesn't expose it
- [x] Confirm dialogs - Add confirmation before deleting items
- [x] Info modal - View full description in a modal popup
- [x] Private items - Mark items as private to hide from family

## Phase 3: Family Features
- [ ] Family activity feed - See when family members add/watch something
- [ ] Voting system - Family members vote on what to watch next
- [ ] Shared ratings - See family members' ratings on items
- [ ] Multiple family groups - Support being in more than one group

## Phase 4: Plex Integration

### Option A: Library Availability (Recommended First Step)
- [ ] Configure Plex server URL and token in backend settings
- [ ] Add endpoint to check if title exists in Plex library
- [ ] Show "Available on Plex" badge on watchlist items
- [ ] Add direct link to play in Plex

### Option B: Watch History Sync
- [ ] Pull watch history from Plex/Tautulli
- [ ] Auto-update items to "watched" status when played in Plex
- [ ] Sync ratings from Plex

### Option C: Plex Watchlist Sync
- [ ] Implement Plex OAuth authentication
- [ ] Two-way sync between app watchlist and Plex watchlist
- [ ] Handle conflicts when items exist in both

### Option D: Request Integration (Overseerr/Ombi)
- [ ] Integrate with Overseerr or Ombi API
- [ ] Add "Request" button for items not in Plex library
- [ ] Show request status on watchlist items

### Authentication Options
- **Server-side only**: Configure Plex token in `.env` (simplest, shared library)
- **Plex OAuth**: User authorizes app to access their Plex.tv account
- **Manual token**: User provides their Plex token in settings

## Phase 5: Polish & Security
- [ ] Password reset - Email-based password recovery
- [ ] Rate limiting - Prevent API abuse
- [ ] Optimistic UI updates - Faster-feeling interactions
- [x] Mobile responsive - Better mobile layout

## Quick Wins
- [ ] Fix random picker to use MongoDB `$sample` (current implementation is slow)
- [ ] Add loading spinners during API calls
- [ ] Better error messages
