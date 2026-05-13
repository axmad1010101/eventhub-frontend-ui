/**
 * Organizer API layer — mock delays + in-memory event list so the UI can
 * create, edit, and delete without a real server.
 *
 * Future ASP.NET routes (see EventHub.API EventController / AttachmentController):
 *   GET    /api/event/organizer/{organizerId}
 *   GET    /api/event/{id}
 *   POST   /api/event
 *   PUT    /api/event/{id}
 *   DELETE /api/event/{id}
 *   GET    /api/event/{eventId}/organizer-analytics
 *   POST   /api/attachment/upload?eventId={eventId}
 *
 * Event create/update JSON (align with backend DTO later):
 *   {
 *     organizerId, categoryId, title, description, venue, eventDate, image,
 *     price, totalTickets, availableTickets
 *   }
 */

import {
  organizerEvents as seedOrganizerEvents,
  recentActivity as seedRecentActivity,
} from '../data/mockOrganizerData.js'

const FAKE_DELAY_MS = 150

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Working copy of events — mutated by create/update/delete in dev. */
let eventsStore = seedOrganizerEvents.map((e) => ({ ...e }))

function cloneEvents() {
  return eventsStore.map((e) => ({ ...e }))
}

function computeStatsFromEvents(events) {
  const totalEvents = events.length
  const approvedEvents = events.filter((e) => e.status === 'Approved').length
  const pendingEvents = events.filter((e) => e.status === 'Pending').length
  const rejectedEvents = events.filter((e) => e.status === 'Rejected').length
  const ticketsSold = events.reduce((sum, e) => sum + (Number(e.ticketsSold) || 0), 0)
  const totalRevenue = events.reduce((sum, e) => sum + (Number(e.revenue) || 0), 0)
  const rated = events.filter((e) => Number(e.averageRating) > 0)
  const averageRating =
    rated.length === 0 ? 0 : rated.reduce((s, e) => s + Number(e.averageRating), 0) / rated.length
  const today = new Date().toISOString().slice(0, 10)
  const upcomingEvents = events.filter(
    (e) => e.status !== 'Rejected' && String(e.date) >= today,
  ).length

  return {
    totalEvents,
    approvedEvents,
    pendingEvents,
    rejectedEvents,
    ticketsSold,
    totalRevenue,
    averageRating: Math.round(averageRating * 100) / 100,
    upcomingEvents,
  }
}

/** Dashboard summary — today derived from the in-memory event list. */
export async function getOrganizerStats() {
  await delay(FAKE_DELAY_MS)
  return computeStatsFromEvents(eventsStore)
}

/** GET /api/event/organizer/{organizerId} — mock returns full store. */
export async function getOrganizerEvents() {
  await delay(FAKE_DELAY_MS)
  return cloneEvents()
}

/** GET /api/event/{id} */
export async function getOrganizerEventById(id) {
  await delay(FAKE_DELAY_MS)
  const found = eventsStore.find((e) => String(e.id) === String(id))
  return found ? { ...found } : null
}

/**
 * POST /api/event — mock pushes a new Pending row.
 * `eventData` matches EventForm output shape (see EventForm onSubmit).
 */
export async function createOrganizerEvent(eventData) {
  await delay(FAKE_DELAY_MS)
  const id = `org-evt-${Date.now()}`
  const totalTickets = Number(eventData.totalTickets) || 1
  const ticketPrice = Number(eventData.ticketPrice) || 0
  const row = {
    id,
    title: String(eventData.title ?? '').trim(),
    category: String(eventData.category ?? 'Music'),
    categoryId: `cat-${String(eventData.category ?? 'misc')
      .toLowerCase()
      .replace(/\s+/g, '-')}`,
    venue: String(eventData.venue ?? '').trim(),
    date: String(eventData.date ?? ''),
    time: String(eventData.time ?? ''),
    description: String(eventData.description ?? '').trim(),
    ticketPrice,
    totalTickets,
    availableTickets: totalTickets,
    ticketsSold: 0,
    revenue: 0,
    averageRating: 0,
    status: 'Pending',
    imageUrl:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=70',
  }
  eventsStore = [...eventsStore, row]
  return { ok: true, id, eventData: row }
}

/** PUT /api/event/{id} */
export async function updateOrganizerEvent(eventId, eventData) {
  await delay(FAKE_DELAY_MS)
  const idx = eventsStore.findIndex((e) => String(e.id) === String(eventId))
  if (idx === -1) return { ok: false, eventId, error: 'not_found' }
  const prev = eventsStore[idx]
  const totalTickets = Number(eventData.totalTickets ?? prev.totalTickets) || 1
  const sold = Number(prev.ticketsSold) || 0
  const next = {
    ...prev,
    title: String(eventData.title ?? prev.title).trim(),
    description: String(eventData.description ?? prev.description).trim(),
    category: String(eventData.category ?? prev.category),
    venue: String(eventData.venue ?? prev.venue).trim(),
    date: String(eventData.date ?? prev.date),
    time: String(eventData.time ?? prev.time),
    ticketPrice: Number(eventData.ticketPrice ?? prev.ticketPrice),
    totalTickets,
    availableTickets: Math.max(0, totalTickets - sold),
  }
  eventsStore = eventsStore.map((e, i) => (i === idx ? next : e))
  return { ok: true, eventId, eventData: next }
}

/** DELETE /api/event/{id} */
export async function deleteOrganizerEvent(eventId) {
  await delay(FAKE_DELAY_MS)
  const before = eventsStore.length
  eventsStore = eventsStore.filter((e) => String(e.id) !== String(eventId))
  return { ok: eventsStore.length < before, eventId }
}

/**
 * GET /api/event/{eventId}/organizer-analytics — mock bundle for the analytics page.
 * Returns stats, full rows, top performer by revenue, and simple availability metrics.
 */
export async function getOrganizerAnalytics() {
  await delay(FAKE_DELAY_MS)
  const events = cloneEvents()
  const stats = computeStatsFromEvents(eventsStore)
  const topPerformingEvent =
    events.length === 0
      ? null
      : [...events].sort((a, b) => (Number(b.revenue) || 0) - (Number(a.revenue) || 0))[0]

  const ticketAvailability = events.map((e) => {
    const total = Number(e.totalTickets) || 0
    const sold = Number(e.ticketsSold) || 0
    const pct = total === 0 ? 0 : Math.round((sold / total) * 1000) / 10
    return {
      id: e.id,
      title: e.title,
      percentSold: pct,
      ticketsSold: sold,
      totalTickets: total,
    }
  })

  return {
    stats,
    events,
    topPerformingEvent,
    ticketAvailability,
    recentActivity: seedRecentActivity.map((a) => ({ ...a })),
  }
}

/** Recent activity lines (same data as dashboard) — kept separate for clarity. */
export async function getOrganizerRecentActivity() {
  await delay(FAKE_DELAY_MS)
  return seedRecentActivity.map((a) => ({ ...a }))
}
