// Watchlist helpers (localStorage-based).
//
// What is localStorage?
// ----------------------
// localStorage is a small key/value storage built into the browser.
// Data saved there stays even after the user refreshes or closes the tab.
// We use it as a temporary store for the watchlist while the backend isn't ready.
//
// Why store only event IDs (not full event objects)?
// --------------------------------------------------
// 1) IDs are tiny -> we don't waste localStorage space.
// 2) Event details (title, price, ratings...) can change in the future. If we
//    saved a full snapshot, it would get stale. Storing just the ID lets us
//    always look up the latest event data from `mockEvents` (or the API later).

const STORAGE_KEY = 'eventhub_watchlist'

// Convert any id (string from URL, string from mock data, number, etc.)
// to a single consistent type: Number. This way we never get duplicates
// like ['1', 1] in localStorage.
function toId(id) {
  return Number(id)
}

// Read the saved IDs array from localStorage.
// Returns [] if nothing is saved or if the data is broken.
export function getWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Normalize every id to a Number for consistency.
    return parsed.map(toId).filter((n) => !Number.isNaN(n))
  } catch {
    return []
  }
}

// Save the IDs array back to localStorage as JSON.
export function saveWatchlist(watchlist) {
  const safe = Array.isArray(watchlist) ? watchlist.map(toId) : []
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
}

// Check if a specific event id is already saved.
export function isEventInWatchlist(eventId) {
  const id = toId(eventId)
  return getWatchlist().includes(id)
}

// Add an event id (no duplicates).
// Returns the updated watchlist.
export function addToWatchlist(eventId) {
  const id = toId(eventId)
  const current = getWatchlist()
  if (current.includes(id)) return current
  const updated = [...current, id]
  saveWatchlist(updated)
  return updated
}

// Remove an event id.
// Returns the updated watchlist.
export function removeFromWatchlist(eventId) {
  const id = toId(eventId)
  const updated = getWatchlist().filter((savedId) => savedId !== id)
  saveWatchlist(updated)
  return updated
}
