import { useState } from 'react'
import { Link } from 'react-router-dom'

import BookingModal from './BookingModal.jsx'
import {
  addToWatchlist,
  isEventInWatchlist,
  removeFromWatchlist,
} from '../utils/watchlist.js'

export default function EventCard({ event, onWatchlistChange }) {
  // Props are inputs passed into a component (like function arguments).
  // This component is reusable because we can render it for any event object.

  // `useState` lets us remember whether THIS event is saved.
  // When we update state, React re-renders the component so the button text
  // changes instantly (without needing to reload the page).
  const [saved, setSaved] = useState(() => isEventInWatchlist(event.id))

  // Controls whether the booking modal is visible.
  // useState gives us a simple toggle without any global state.
  const [bookingOpen, setBookingOpen] = useState(false)

  function handleToggleWatchlist() {
    if (saved) {
      removeFromWatchlist(event.id)
      setSaved(false)
    } else {
      addToWatchlist(event.id)
      setSaved(true)
    }
    // Let parent components (like WatchlistPage) react if they need to.
    if (typeof onWatchlistChange === 'function') {
      onWatchlistChange(event.id)
    }
  }

  // Open the booking modal. Real checkout will replace this UI later.
  function handleBookTicket() {
    setBookingOpen(true)
  }

  return (
    <article className="event-card">
      {/* Event image — consistent crop via CSS (object-fit: cover) */}
      <div className="event-card__media">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} loading="lazy" />
        ) : (
          <div className="event-card__placeholder" aria-hidden="true">
            <span>No image</span>
          </div>
        )}
      </div>

      <div className="event-card__body">
        <div className="event-card__top">
          <h2 className="event-card__title">{event.title}</h2>
          <div className="event-card__meta">
            <span className="pill">{event.category}</span>
            <span className="muted">{event.venue}</span>
          </div>
        </div>

        <dl className="event-card__details">
          <div className="row">
            <dt>Date</dt>
            <dd>{event.date}</dd>
          </div>
          <div className="row">
            <dt>Time</dt>
            <dd>{event.time}</dd>
          </div>
          <div className="row">
            <dt>Ticket</dt>
            <dd>{event.ticketPrice} EGP</dd>
          </div>
          <div className="row">
            <dt>Available</dt>
            <dd>{event.availableTickets}</dd>
          </div>
          <div className="row">
            <dt>Rating</dt>
            <dd>{event.averageRating} / 5</dd>
          </div>
        </dl>

        <div className="event-card__actions">
          {/* Main action: booking (not wired to a backend yet) */}
          <button type="button" className="btn-book btn-book--block" onClick={handleBookTicket}>
            Book Ticket
          </button>

          <div className="event-card__row">
            {/* Link navigates without reloading the page */}
            <Link className="btn-view-details" to={`/events/${event.id}`}>
              View Details
            </Link>
            <button
              type="button"
              className={`btn-soft ${saved ? 'btn-soft--saved' : ''}`}
              onClick={handleToggleWatchlist}
              aria-pressed={saved}
            >
              {saved ? 'Saved ✓' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>

      {bookingOpen && (
        <BookingModal event={event} onClose={() => setBookingOpen(false)} />
      )}
    </article>
  )
}
