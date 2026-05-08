// Ratings helpers (localStorage-based).
//
// What is localStorage?
// ---------------------
// localStorage is a small key/value storage built into the browser.
// Data saved there stays even after a refresh, so the user's rating
// is remembered between visits (until the backend is ready).
//
// Why store ratings by event ID?
// ------------------------------
// We use an object like { "1": 5, "2": 4 } where the key is the event id
// and the value is the rating. This makes lookups very simple: just
// check ratings[eventId]. No looping through arrays needed.

const STORAGE_KEY = 'eventhub_ratings'

// Read the whole ratings object from localStorage.
// Returns {} if nothing is saved or the data is broken.
export function getRatings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return parsed
  } catch {
    return {}
  }
}

// Save the whole ratings object back to localStorage as JSON.
export function saveRatings(ratings) {
  const safe = ratings && typeof ratings === 'object' ? ratings : {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
}

// Get the rating for one event, or null if it hasn't been rated.
export function getEventRating(eventId) {
  const ratings = getRatings()
  const value = ratings[String(eventId)]
  return typeof value === 'number' ? value : null
}

// Save a rating (1..5) for one event.
// Returns the updated ratings object.
export function saveEventRating(eventId, rating) {
  const ratings = getRatings()
  ratings[String(eventId)] = Number(rating)
  saveRatings(ratings)
  return ratings
}
