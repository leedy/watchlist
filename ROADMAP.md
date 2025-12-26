# Watchlist App Roadmap

## Phase 1: Core Improvements
- [ ] Search & filter - Find items by title, filter by type (movie/tv)
- [ ] Sorting options - Sort by date added, title, rating, status
- [ ] Pagination - Handle large watchlists efficiently
- [ ] Input validation - Add server-side validation (Joi/Zod) to prevent bad data

## Phase 2: Enhanced User Experience
- [ ] Edit items - Currently you can only add/delete, not edit details
- [ ] Poster images - Integrate with TMDB or OMDB API to auto-fetch movie/show posters
- [ ] Notes/comments - The model supports notes but UI doesn't expose it
- [ ] Confirm dialogs - Add confirmation before deleting items

## Phase 3: Family Features
- [ ] Family activity feed - See when family members add/watch something
- [ ] Voting system - Family members vote on what to watch next
- [ ] Shared ratings - See family members' ratings on items
- [ ] Multiple family groups - Support being in more than one group

## Phase 4: Polish & Security
- [ ] Password reset - Email-based password recovery
- [ ] Rate limiting - Prevent API abuse
- [ ] Optimistic UI updates - Faster-feeling interactions
- [ ] Mobile responsive - Better mobile layout

## Quick Wins
- [ ] Fix random picker to use MongoDB `$sample` (current implementation is slow)
- [ ] Add loading spinners during API calls
- [ ] Better error messages
