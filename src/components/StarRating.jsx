import { useState } from 'react'

import { getEventRating, saveEventRating } from '../utils/ratings.js'

export default function StarRating({ eventId }) {
  // `useState` remembers the user's current rating.
  // We initialize it from localStorage so a saved rating shows up right away.
  // If nothing is saved yet, `getEventRating` returns null.
  const [rating, setRating] = useState(() => getEventRating(eventId))

  // `hover` lets us preview the rating as the user moves the mouse.
  // It's separate from `rating` so we don't save anything until they click.
  const [hover, setHover] = useState(0)

  function handleClick(value) {
    // Update the UI instantly with useState, then save to localStorage.
    setRating(value)
    saveEventRating(eventId, value)
  }

  // We render 5 stars. The "active" count is whichever is currently being
  // hovered, or the saved rating if no hover is happening.
  const active = hover || rating || 0
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="star-rating">
      <div
        className="star-rating__stars"
        role="radiogroup"
        aria-label="Rate this event from 1 to 5 stars"
      >
        {stars.map((value) => {
          const isActive = value <= active
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value === 1 ? '' : 's'}`}
              className={`star ${isActive ? 'star--active' : ''}`}
              onClick={() => handleClick(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </button>
          )
        })}
      </div>

      <p className="star-rating__label">
        {rating ? `Your rating: ${rating}/5` : 'No rating yet'}
      </p>
    </div>
  )
}
