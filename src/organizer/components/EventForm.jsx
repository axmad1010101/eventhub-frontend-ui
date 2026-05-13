import { useState } from 'react'

/**
 * Dropdown labels for category (display only today).
 * Later: replace with options from GET /api/category and store categoryId.
 */
const CATEGORY_OPTIONS = [
  'Music',
  'Sports',
  'Culture',
  'Education',
  'Travel',
  'Food',
  'Technology',
  'Business',
]

const DEFAULT_FIELDS = {
  title: '',
  description: '',
  category: 'Music',
  venue: '',
  date: '',
  time: '',
  ticketPrice: 0,
  totalTickets: 1,
}

function fieldsFromInitial(initialData) {
  if (!initialData || typeof initialData !== 'object') return { ...DEFAULT_FIELDS }
  return {
    title: initialData.title ?? '',
    description: initialData.description ?? '',
    category: initialData.category ?? 'Music',
    venue: initialData.venue ?? '',
    date: initialData.date ?? '',
    time: initialData.time ?? '',
    ticketPrice: Number(initialData.ticketPrice ?? 0),
    totalTickets: Math.max(1, Number(initialData.totalTickets ?? 1)),
  }
}

function validate(fields) {
  if (!String(fields.title).trim()) return 'Title is required.'
  if (!String(fields.description).trim()) return 'Description is required.'
  if (!String(fields.venue).trim()) return 'Venue is required.'
  if (!String(fields.date).trim()) return 'Date is required.'
  if (!String(fields.time).trim()) return 'Time is required.'
  const tp = fields.ticketPrice === '' ? NaN : Number(fields.ticketPrice)
  if (Number.isNaN(tp) || tp < 0) return 'Ticket price cannot be negative.'
  const tot = fields.totalTickets === '' ? NaN : Number(fields.totalTickets)
  if (Number.isNaN(tot) || tot < 1) return 'Total tickets must be at least 1.'
  return ''
}

/**
 * Shared create / edit form for organizer events.
 *
 * Props:
 * - mode: "create" | "edit"
 * - initialData: partial event object (edit loads from API later)
 * - onSubmit: (formPayload) => void — parent handles success UI
 */
export default function EventForm({ mode, initialData, onSubmit }) {
  const [fields, setFields] = useState(() => fieldsFromInitial(initialData))
  const [submitError, setSubmitError] = useState('')

  function updateField(name, value) {
    setSubmitError('')
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    const err = validate(fields)
    if (err) {
      setSubmitError(err)
      return
    }

    const imageInput = event.currentTarget.querySelector('input[name="eventImage"]')
    const attachInput = event.currentTarget.querySelector('input[name="attachment"]')
    const imageFile = imageInput?.files?.[0] ?? null
    const attachmentFile = attachInput?.files?.[0] ?? null

    const formData = {
      mode,
      title: fields.title.trim(),
      description: fields.description.trim(),
      category: fields.category,
      venue: fields.venue.trim(),
      date: fields.date,
      time: fields.time,
      ticketPrice: Number(fields.ticketPrice),
      totalTickets: Number(fields.totalTickets),
      imageFileName: imageFile ? imageFile.name : null,
      attachmentFileName: attachmentFile ? attachmentFile.name : null,
    }

    onSubmit?.(formData)
  }

  const submitLabel = mode === 'create' ? 'Submit event' : 'Save changes'

  return (
    <form className="organizer-form" onSubmit={handleSubmit} noValidate>
      {submitError ? (
        <p className="organizer-form__error" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="organizer-form__grid">
        <label className="organizer-field organizer-field--full">
          <span className="organizer-field__label">Title</span>
          <input
            className="organizer-field__input"
            type="text"
            name="title"
            value={fields.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
        </label>

        <label className="organizer-field organizer-field--full">
          <span className="organizer-field__label">Description</span>
          <textarea
            className="organizer-field__input organizer-field__input--textarea"
            name="description"
            rows={4}
            value={fields.description}
            onChange={(e) => updateField('description', e.target.value)}
            required
          />
        </label>

        <label className="organizer-field">
          <span className="organizer-field__label">Category</span>
          <select
            className="organizer-field__input"
            name="category"
            value={fields.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="organizer-field">
          <span className="organizer-field__label">Venue</span>
          <input
            className="organizer-field__input"
            type="text"
            name="venue"
            value={fields.venue}
            onChange={(e) => updateField('venue', e.target.value)}
            required
          />
        </label>

        <label className="organizer-field">
          <span className="organizer-field__label">Date</span>
          <input
            className="organizer-field__input"
            type="date"
            name="date"
            value={fields.date}
            onChange={(e) => updateField('date', e.target.value)}
            required
          />
        </label>

        <label className="organizer-field">
          <span className="organizer-field__label">Time</span>
          <input
            className="organizer-field__input"
            type="time"
            name="time"
            value={fields.time}
            onChange={(e) => updateField('time', e.target.value)}
            required
          />
        </label>

        <label className="organizer-field">
          <span className="organizer-field__label">Ticket price (EGP)</span>
          <input
            className="organizer-field__input"
            type="number"
            name="ticketPrice"
            min={0}
            step={1}
            value={fields.ticketPrice}
            onChange={(e) => updateField('ticketPrice', e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>

        <label className="organizer-field">
          <span className="organizer-field__label">Total tickets</span>
          <input
            className="organizer-field__input"
            type="number"
            name="totalTickets"
            min={1}
            step={1}
            value={fields.totalTickets}
            onChange={(e) => updateField('totalTickets', e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>

        <div className="organizer-field organizer-field--full">
          <span className="organizer-field__label">Event image</span>
          <input className="organizer-field__input" type="file" name="eventImage" accept="image/*" />
          <p className="organizer-field__hint">Choose a poster or banner image for this event.</p>
        </div>

        <div className="organizer-field organizer-field--full">
          <span className="organizer-field__label">Attachment</span>
          <input className="organizer-field__input" type="file" name="attachment" />
          <p className="organizer-field__hint">Optional brochure, rider, or other PDF.</p>
        </div>
      </div>

      <div className="organizer-form__actions">
        <button type="submit" className="organizer-btn organizer-btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
