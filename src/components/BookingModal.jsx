import { useEffect, useState } from 'react'

export default function BookingModal({ event, onClose }) {
  const [quantity, setQuantity] = useState(1)
  const [confirmed, setConfirmed] = useState(false)
  const [ticketId, setTicketId] = useState(null)

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  if (!event) return null

  const totalPrice = event.ticketPrice * quantity

  function handleConfirm() {
    const id = `TIX-${Math.floor(100000 + Math.random() * 900000)}`
    setTicketId(id)
    setConfirmed(true)
  }

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
                Booking confirmed
              </h2>
            </header>

            <div className="modal-success">
              <p className="modal-success__lead">Ticket reserved successfully.</p>

              <p className="booking-ticket-id">
                Ticket ID: <strong className="mono">{ticketId}</strong>
              </p>

              {/*
                QR preview: CSS-only stand-in. Later replace with real ticket QR from the API, e.g.
                GET /api/ticket/qrcode/{qrCode}
              */}
              <div
                className="booking-qr-placeholder"
                role="img"
                aria-label="QR code preview (illustration only)"
              />

              <p className="booking-qr-foot">Show this code at the event entrance.</p>

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
