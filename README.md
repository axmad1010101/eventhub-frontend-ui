# EventHub Participant UI

This is the frontend Participant UI module for the EventHub university project.

The project is built with React + Vite and focuses on the participant-facing side of the event platform.

## Features

- Event browsing homepage
- Hero slider with featured events
- Event cards with images
- Filter events by category
- Filter events by venue
- Search events by name
- Event details page
- Add/remove events from watchlist
- Watchlist page
- 5-star rating system
- Book Ticket demo modal
- Login and Sign Up placeholder pages
- Mock data used until backend APIs are ready

## Tech Stack

- React
- Vite
- React Router
- CSS
- localStorage for temporary watchlist and ratings

## Project Structure

```txt
src/
  components/
    BookingModal.jsx
    EventCard.jsx
    FilterBar.jsx
    HeroSlider.jsx
    Navbar.jsx
    StarRating.jsx

  data/
    mockEvents.js

  pages/
    EventDetailsPage.jsx
    HomePage.jsx
    LoginPage.jsx
    SignUpPage.jsx
    WatchlistPage.jsx

  services/
    eventService.js

  styles/
    participant.css

  utils/
    ratings.js
    watchlist.js