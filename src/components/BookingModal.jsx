import { useEffect, useState } from 'react'

export default function BookingModal({ event, onClose }) {
  // `quantity` controls how many tickets the user wants to book (1..5).
  const [quantity, setQuantity] = useState(1)

  // `confirmed` flips to true after the user clicks "Confirm Booking".
  // We then show the success view inside the same modal.
  const [confirmed, setConfirmed] = useState(false)

  // `bookingId` is a fake reference number generated when we confirm.
  const [bookingId, setBookingId] = useState(null)

  // Close on Escape so keyboard users aren't trapped.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  if (!event) return null

  // Total price recalculates on every render based on the current quantity.
  const totalPrice = event.ticketPrice * quantity

  function handleConfirm() {
    // Fake reference number — replace with the API response when backend exists.
    const fakeId = `EVT-${Math.floor(10000 + Math.random() * 90000)}`
    setBookingId(fakeId)
    setConfirmed(true)
  }

  // Click outside the card closes the modal. We stop propagation inside the card
  // so clicks on inputs/buttons don't bubble up and close it accidentally.
  function handleOverlayClick() {
    onClose?.()
  }
  function stopPropagation(e) {
    e.stopPropagation()
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={handleOverlayClick}
    >
      <div className="modal-card" onClick={stopPropagation}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close booking dialog"
        >
          ×
        </button>

        {!confirmed ? (
          <>
            <header className="modal-header">
              <span className="auth-card__subtitle">Book Tickets</span>
              <h2 id="booking-modal-title" className="modal-title">
                {event.title}
              </h2>
              <p className="muted modal-venue">{event.venue}</p>
            </header>

            <dl className="details-list modal-details">
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

            <label className="field">
              <span className="field__label">Quantity</span>
              <select
                className="field__control"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <div className="modal-total">
              <span>Total</span>
              <strong>{totalPrice} EGP</strong>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-soft btn-soft--block" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-book btn-book--block"
                onClick={handleConfirm}
              >
                Confirm Booking
              </button>
            </div>
          </>
        ) : (
          <>
            <header className="modal-header">
              <h2 id="booking-modal-title" className="modal-title">
                Ticket reserved
              </h2>
              <p className="muted">
                Booking reference: <strong className="mono">{bookingId}</strong>
              </p>
            </header>

            <div className="modal-success">
              <p>
                Ticket reserved successfully. Backend booking and QR code will be
                connected later.
              </p>
              <dl className="details-list modal-details">
                <div className="row">
                  <dt>Event</dt>
                  <dd>{event.title}</dd>
                </div>
                <div className="row">
                  <dt>Quantity</dt>
                  <dd>{quantity}</dd>
                </div>
                <div className="row">
                  <dt>Total</dt>
                  <dd>{totalPrice} EGP</dd>
                </div>
              </dl>
            </div>

            <div className="modal-actions modal-actions--single">
              <button type="button" className="btn-book btn-book--block" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
