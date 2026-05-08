import { useEffect, useState } from 'react'

import EventCard from '../components/EventCard.jsx'
import FilterBar from '../components/FilterBar.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import { getEvents, getFilteredEvents } from '../services/eventService.js'

export default function HomePage() {
  // `useState` lets us store values that can change over time (like filter inputs).
  // When state changes, React re-renders the component with the new values.
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedVenue, setSelectedVenue] = useState('All')

  // Events come from the service layer (mock today, real API later).
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Build the dropdown options from a one-time fetch of all events.
  // We also keep the full unfiltered list to feed the hero slider (which
  // shows featured events regardless of the user's filter choices).
  const [allEvents, setAllEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [venues, setVenues] = useState([])

  // `useEffect` with [] runs once when the page first loads.
  // We fetch all events to extract the unique list of categories/venues
  // and to populate the hero slider.
  useEffect(() => {
    let active = true

    async function loadFilters() {
      const all = await getEvents()
      if (!active) return
      setAllEvents(all)
      // `new Set(...)` removes duplicates, then we turn it back into an array.
      setCategories(Array.from(new Set(all.map((e) => e.category))).sort())
      setVenues(Array.from(new Set(all.map((e) => e.venue))).sort())
    }

    loadFilters()
    // Cleanup flag prevents updating state if the page unmounts mid-fetch.
    return () => {
      active = false
    }
  }, [])

  // `useEffect` with dependencies re-runs whenever a filter changes.
  // Today this calls our service which filters mock data; later it will
  // hit the backend API with the same inputs.
  useEffect(() => {
    let active = true

    async function loadEvents() {
      setLoading(true)
      const data = await getFilteredEvents({
        searchTerm,
        category: selectedCategory,
        venue: selectedVenue,
      })
      if (!active) return
      setEvents(data)
      setLoading(false)
    }

    loadEvents()
    return () => {
      active = false
    }
  }, [searchTerm, selectedCategory, selectedVenue])

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-title">Browse Events</h1>
        <p className="page-subtitle">Find events by category, venue, or name.</p>
      </header>

      {/* Hero only renders once the full event list is loaded. It always
          shows featured events from the full list — filters don't affect it. */}
      {allEvents.length > 0 && <HeroSlider events={allEvents} />}

      <FilterBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedVenue={selectedVenue}
        setSelectedVenue={setSelectedVenue}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        venues={venues}
      />

      {loading ? (
        <div className="empty-state">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">No events found. Try changing your filters.</div>
      ) : (
        <div className="event-grid">
          {/* `.map()` lets us turn an array into a list of React elements */}
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}
