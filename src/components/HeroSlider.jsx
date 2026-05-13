import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import BookingModal from './BookingModal.jsx'

export default function HeroSlider({ events }) {
  // Featured = first 4 only. Grid below still uses the full filtered list on HomePage.
  const featured = (events || []).slice(0, 4)

  const [currentSlide, setCurrentSlide] = useState(0)

  // When non-null, the booking modal is open for *this* event only (slide does not change underneath).
  const [bookingEvent, setBookingEvent] = useState(null)

  // Auto-slide every 4 seconds — paused while a booking modal is open.
  useEffect(() => {
    if (featured.length <= 1 || bookingEvent) return

    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featured.length)
    }, 4000)

    return () => clearInterval(intervalId)
  }, [featured.length, bookingEvent])

  if (featured.length === 0) return null

  const event = featured[currentSlide]

  function goPrev() {
    setCurrentSlide((prev) => (prev - 1 + featured.length) % featured.length)
  }

  function goNext() {
    setCurrentSlide((prev) => (prev + 1) % featured.length)
  }

  function goTo(index) {
    setCurrentSlide(index)
  }

  function handleBookTicket() {
    setBookingEvent(featured[currentSlide])
  }

  function handleCloseBooking() {
    setBookingEvent(null)
  }

  return (
    <section className="hero-slider" aria-label="Featured events">
      <div className="hero-slider__media">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} />
        ) : (
          <div className="hero-slider__placeholder" aria-hidden="true">
            No image
          </div>
        )}
      </div>

      <div className="hero-slider__content">
        <span className="hero-slider__eyebrow">Featured Event</span>
        <h2 className="hero-slider__title">{event.title}</h2>

        <div className="hero-slider__meta">
          <span className="pill">{event.category}</span>
          <span className="muted">{event.venue}</span>
        </div>

        <p className="hero-slider__details">
          <span>{event.date}</span>
          <span aria-hidden="true">·</span>
          <span>{event.time}</span>
          <span aria-hidden="true">·</span>
          <span>{event.ticketPrice} EGP</span>
        </p>

        <div className="hero-slider__actions">
          <button type="button" className="btn-book" onClick={handleBookTicket}>
            Book Ticket
          </button>
          <Link className="btn-view-details" to={`/events/${event.id}`}>
            View Details
          </Link>
        </div>
      </div>

      {featured.length > 1 && (
        <>
          <button
            type="button"
            className="hero-slider__nav hero-slider__nav--prev"
            onClick={goPrev}
            aria-label="Previous featured event"
          >
            ‹
          </button>
          <button
            type="button"
            className="hero-slider__nav hero-slider__nav--next"
            onClick={goNext}
            aria-label="Next featured event"
          >
            ›
          </button>

          <div className="hero-slider__dots" role="tablist" aria-label="Slide indicators">
            {featured.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`Go to slide ${index + 1}`}
                className={`hero-slider__dot ${
                  index === currentSlide ? 'hero-slider__dot--active' : ''
                }`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </>
      )}

      {bookingEvent ? (
        <BookingModal key={bookingEvent.id} event={bookingEvent} onClose={handleCloseBooking} />
      ) : null}
    </section>
  )
}
