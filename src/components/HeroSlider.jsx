import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import BookingModal from './BookingModal.jsx'

export default function HeroSlider({ events }) {
  // Featured = the first 4 events. Slice copies so we don't mutate the prop.
  const featured = (events || []).slice(0, 4)

  // `currentSlide` is the index of the slide currently shown.
  // useState remembers it across renders.
  const [currentSlide, setCurrentSlide] = useState(0)

  // Controls visibility of the booking modal for the active slide.
  const [bookingOpen, setBookingOpen] = useState(false)

  // Auto-slide every 4 seconds.
  // useEffect runs after each render; the cleanup (clearInterval) prevents
  // stacking multiple timers.
  useEffect(() => {
    if (featured.length <= 1) return

    const intervalId = setInterval(() => {
      // Use the functional form so we always advance from the latest value.
      setCurrentSlide((prev) => (prev + 1) % featured.length)
    }, 4000)

    return () => clearInterval(intervalId)
  }, [featured.length])

  // If we don't have events yet, render nothing (HomePage also guards this).
  if (featured.length === 0) return null

  const event = featured[currentSlide]

  // Going to the previous slide wraps around to the last item.
  function goPrev() {
    setCurrentSlide((prev) => (prev - 1 + featured.length) % featured.length)
  }

  // Going to the next slide wraps around to the first item.
  function goNext() {
    setCurrentSlide((prev) => (prev + 1) % featured.length)
  }

  function goTo(index) {
    setCurrentSlide(index)
  }

  // Open the booking modal for the currently displayed slide.
  function handleBookTicket() {
    setBookingOpen(true)
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

      {bookingOpen && (
        <BookingModal event={event} onClose={() => setBookingOpen(false)} />
      )}
    </section>
  )
}
