import { useEffect, useState } from 'react'

import EventCard from '../components/EventCard.jsx'
import { getEvents } from '../services/eventService.js'
import {
  getWatchlist,
  removeFromWatchlist,
  saveWatchlist,
} from '../utils/watchlist.js'

export default function WatchlistPage() {
  // Read saved IDs from localStorage on first render.
  // We keep the IDs in state so the page can update instantly when we remove items.
  const [savedIds, setSavedIds] = useState(() => getWatchlist())

  // The full list of events comes from the service (mock today, API later).
  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      const data = await getEvents()
      if (!active) return
      setAllEvents(data)
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [])

  // Filter the events to only the ones whose id is in our saved list.
  // We compare as numbers so string vs number IDs don't mismatch.
  const savedEvents = allEvents.filter((event) =>
    savedIds.includes(Number(event.id)),
  )

  function handleRemove(eventId) {
    // Update localStorage AND the local state so the UI re-renders immediately.
    const updated = removeFromWatchlist(eventId)
    setSavedIds(updated)
  }

  function handleClearAll() {
    saveWatchlist([])
    setSavedIds([])
  }

  // Called when the user toggles the "Saved ✓" / "Add to Watchlist" button
  // inside an EventCard. We just re-read localStorage to stay in sync.
  function handleCardToggle() {
    setSavedIds(getWatchlist())
  }

  return (
    <section className="page">
      <header className="page-header watchlist-header">
        <div>
          <h1 className="page-title">My Watchlist</h1>
          <p className="page-subtitle">
            {loading
              ? 'Loading your watchlist...'
              : savedEvents.length === 0
                ? 'Saved events will appear here.'
                : `You have ${savedEvents.length} saved event${
                    savedEvents.length === 1 ? '' : 's'
                  }.`}
          </p>
        </div>

        {!loading && savedEvents.length > 0 && (
          <button type="button" className="btn-link" onClick={handleClearAll}>
            Clear Watchlist
          </button>
        )}
      </header>

      {loading ? (
        <div className="empty-state">Loading events...</div>
      ) : savedEvents.length === 0 ? (
        <div className="empty-state empty-state--centered">
          <p className="empty-state__title">Your watchlist is empty.</p>
          <p className="empty-state__hint">
            Browse events and tap "Add to Watchlist" to save them here.
          </p>
        </div>
      ) : (
        <div className="event-grid">
          {savedEvents.map((event) => (
            <div key={event.id} className="watchlist-item">
              <EventCard event={event} onWatchlistChange={handleCardToggle} />
              <button
                type="button"
                className="btn-link btn-link--danger"
                onClick={() => handleRemove(event.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
