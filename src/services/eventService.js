// Service layer for events.
//
// What is a "service" file?
// -------------------------
// A service file is the place where pages/components go to ASK for data.
// Pages don't care WHERE the data comes from (mock array? REST API?
// GraphQL?). They just call something like `getEvents()` and use the result.
//
// Why use this pattern now (before the backend is ready)?
// -------------------------------------------------------
// Today these functions return data from `mockEvents`.
// Later we'll swap them to call a real API (with `fetch` or `axios`).
// Because every page already calls these service functions, we'll only need
// to change the inside of these functions — not every page.
//
// Why `async` even though we're using mock data?
// ----------------------------------------------
// Real network calls are asynchronous. Making these functions `async` now
// means the pages already use `await` and `useEffect` correctly. When we
// switch to real APIs, no page-level code has to change.

import { mockEvents } from '../data/mockEvents.js'

// A tiny artificial delay so loading states feel realistic in development.
// Remove this once we connect to a real backend.
const FAKE_DELAY_MS = 200

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Get all events.
// Future:
//   const res = await fetch('/api/events')
//   if (!res.ok) throw new Error('Failed to load events')
//   return await res.json()
export async function getEvents() {
  await delay(FAKE_DELAY_MS)
  return mockEvents
}

// Get a single event by id.
// Future:
//   const res = await fetch(`/api/events/${id}`)
//   if (res.status === 404) return null
//   if (!res.ok) throw new Error('Failed to load event')
//   return await res.json()
export async function getEventById(id) {
  await delay(FAKE_DELAY_MS)
  // We compare ids as strings to match the URL param shape.
  const found = mockEvents.find((e) => String(e.id) === String(id))
  return found || null
}

// Get events filtered by search/category/venue.
// Future:
//   const params = new URLSearchParams()
//   if (searchTerm) params.set('q', searchTerm)
//   if (category && category !== 'All') params.set('category', category)
//   if (venue && venue !== 'All') params.set('venue', venue)
//   const res = await fetch(`/api/events?${params.toString()}`)
//   return await res.json()
export async function getFilteredEvents({
  searchTerm = '',
  category = 'All',
  venue = 'All',
} = {}) {
  await delay(FAKE_DELAY_MS)
  const term = searchTerm.trim().toLowerCase()

  return mockEvents.filter((event) => {
    const matchesSearch = term === '' || event.title.toLowerCase().includes(term)
    const matchesCategory = category === 'All' ? true : event.category === category
    const matchesVenue = venue === 'All' ? true : event.venue === venue
    return matchesSearch && matchesCategory && matchesVenue
  })
}
