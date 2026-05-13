import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import EventForm from '../components/EventForm.jsx'
import { getOrganizerEventById, updateOrganizerEvent } from '../services/organizerService.js'

/**
 * Edit screen — loads one event by URL id; shows EventForm in edit mode.
 */
export default function EditEvent() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  /** Bump after save so EventForm remounts with fresh server-shaped data (mock). */
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setSuccessMessage('')
      try {
        const row = await getOrganizerEventById(id)
        if (active) setEvent(row ? { ...row } : null)
      } finally {
        if (active) setLoading(false)
      }
    }
    if (id) load()
    return () => {
      active = false
    }
  }, [id])

  async function handleSubmit(formData) {
    await updateOrganizerEvent(id, formData)
    setSuccessMessage('Event updated successfully.')
    const row = await getOrganizerEventById(id)
    setEvent(row ? { ...row } : null)
    setFormKey((k) => k + 1)
  }

  if (loading) {
    return (
      <div className="organizer-page">
        <p className="organizer-muted">Loading event…</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="organizer-page">
        <p className="organizer-banner organizer-banner--warn">Event not found.</p>
        <Link to="/organizer/events" className="organizer-btn organizer-btn--ghost">
          Back to my events
        </Link>
      </div>
    )
  }

  return (
    <div className="organizer-page">
      <header className="organizer-page__header">
        <h1 className="organizer-page__title">Edit event</h1>
        <p className="organizer-page__lead">Update details for: {event.title}</p>
      </header>

      {successMessage ? (
        <p className="organizer-banner organizer-banner--success" role="status">
          {successMessage}
        </p>
      ) : null}

      <div className="organizer-panel">
        <EventForm key={`${id}-${formKey}`} mode="edit" initialData={event} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
