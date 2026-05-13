import { useState } from 'react'

import EventForm from '../components/EventForm.jsx'
import { createOrganizerEvent } from '../services/organizerService.js'

/** Stable empty object so EventForm initial state is predictable on first mount. */
const CREATE_INITIAL = {}

/**
 * Create flow — submits through organizerService (mock append to in-memory list).
 */
export default function CreateEvent() {
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(formData) {
    await createOrganizerEvent(formData)
    setSuccessMessage('Event submitted successfully and is now pending review.')
  }

  return (
    <div className="organizer-page">
      <header className="organizer-page__header">
        <h1 className="organizer-page__title">Create event</h1>
        <p className="organizer-page__lead">Fill in the details to submit your event for review.</p>
      </header>

      {successMessage ? (
        <p className="organizer-banner organizer-banner--success" role="status">
          {successMessage}
        </p>
      ) : null}

      <div className="organizer-panel">
        <EventForm key="organizer-create" mode="create" initialData={CREATE_INITIAL} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
