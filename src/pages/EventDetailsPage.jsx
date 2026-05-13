import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import BookingModal from '../components/BookingModal.jsx'
import StarRating from '../components/StarRating.jsx'
import { getEventById } from '../services/eventService.js'
import {
  addToWatchlist,
  isEventInWatchlist,
  removeFromWatchlist,
} from '../utils/watchlist.js'

export default function EventDetailsPage() {
  // `useParams()` reads URL params like /events/:id
  // Example: if the URL is /events/5 then `id` will be "5"
  const { id } = useParams()

  // Event data comes from the service layer (mock today, real API later).
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  // Track whether THIS event is in the watchlist.
  // useState makes the button label update instantly when we add/remove.
  // The watchlist is keyed by event id, which we already have from the URL,
  // so we can initialize this without waiting for the event to load.
  const [saved, setSaved] = useState(() => isEventInWatchlist(id))

  // Controls the booking modal visibility on this page.
  const [bookingOpen, setBookingOpen] = useState(false)

  // Re-run whenever the URL id changes (e.g. user navigates between events).
  useEffect(() => {
    let active = true

    async function loadEvent() {
      setLoading(true)
      const data = await getEventById(id)
      if (!active) return
      setEvent(data)
      setLoading(false)
    }

    loadEvent()
    return () => {
      active = false
    }
  }, [id])

  function handleToggleWatchlist() {
    if (saved) {
      removeFromWatchlist(id)
      setSaved(false)
    } else {
      addToWatchlist(id)
      setSaved(true)
    }
  }

  // Open the booking modal — backend checkout will hook in here later.
  function handleBookTicket() {
    if (!event) return
    setBookingOpen(true)
  }

  if (loading) {
    return (
      <section className="page page--details">
        <h1>Event Details</h1>
        <div className="details-card">
          <p>Loading event...</p>
        </div>
      </section>
    )
  }

  // If the id doesn't exist in our data, show a clean message instead of crashing.
  if (!event) {
    return (
      <section className="page page--details">
        <h1>Event Details</h1>
        <div className="details-card">
          <p>Event not found.</p>
          <div className="details-actions">
            <Link className="btn-link" to="/">
              Back to Events
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page page--details">
      <div className="details-header">
        <div>
          <h1 className="details-title">{event.title}</h1>
          <div className="details-subtitle">
            <span className="pill">{event.category}</span>
            <span className="muted">{event.venue}</span>
          </div>
        </div>

        <div className="details-actions">
          <Link className="btn-link" to="/">
            Back to Events
          </Link>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          {/* Placeholder image area. If imageUrl exists, we show it. */}
          <div className="details-image" role="img" aria-label={`${event.title} image`}>
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title} />
            ) : (
              <span className="muted">Image coming soon</span>
            )}
          </div>

          <section className="about">
            <h2 className="section-title">About This Event</h2>
            <p>{event.description}</p>
          </section>

          <section className="rating-section">
            <h2 className="section-title">Rating</h2>
            <p className="rating-line">
              Average Rating: <span className="star--active">★</span>{' '}
              {event.averageRating}
            </p>

            <div className="user-rating">
              <h3 className="rating-subtitle">Your Rating</h3>
              <StarRating eventId={event.id} />
            </div>
          </section>
        </div>

        <aside className="details-card ticket-card">
          <h2 className="section-title">Ticket Information</h2>

          <dl className="details-list">
            <div className="row">
              <dt>Date</dt>
              <dd>{event.date}</dd>
            </div>
            <div className="row">
              <dt>Time</dt>
              <dd>{event.time}</dd>
            </div>
            <div className="row">
              <dt>Ticket Price</dt>
              <dd>{event.ticketPrice} EGP</dd>
            </div>
            <div className="row">
              <dt>Available Tickets</dt>
              <dd>{event.availableTickets}</dd>
            </div>
          </dl>

          <button type="button" className="btn-book btn-book--block" onClick={handleBookTicket}>
            Book Ticket
          </button>

          <button
            type="button"
            className={`btn-soft btn-soft--block ${saved ? 'btn-soft--saved' : ''}`}
            onClick={handleToggleWatchlist}
            aria-pressed={saved}
          >
            {saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
        </aside>
      </div>

      {bookingOpen && (
        <BookingModal event={event} onClose={() => setBookingOpen(false)} />
      )}
    </section>
  )
}
