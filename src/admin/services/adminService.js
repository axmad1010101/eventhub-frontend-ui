/**
 * Admin API layer — today everything reads from mock data with a short delay.
 * Pages import only from this file. When the backend is ready, swap the bodies
 * for fetch/axios calls using the routes commented below.
 */

import {
  adminStats,
  organizers,
  pendingEvents,
  users,
} from '../data/mockAdminData.js'

const FAKE_DELAY_MS = 150

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** GET /api/admin/dashboard-stats */
export async function getAdminStats() {
  await delay(FAKE_DELAY_MS)
  return { ...adminStats }
}

/**
 * Events for the admin “Manage events” screen (mock: one array with mixed statuses).
 * Later you might use GET /api/event/pending for queue-only, or a dedicated admin list.
 */
export async function getPendingEvents() {
  await delay(FAKE_DELAY_MS)
  return pendingEvents.map((e) => ({ ...e }))
}

/** POST /api/admin/events/{id}/approve */
export async function approveEvent(eventId) {
  await delay(FAKE_DELAY_MS)
  return { ok: true, eventId }
}

/** POST /api/admin/events/{id}/reject */
export async function rejectEvent(eventId) {
  await delay(FAKE_DELAY_MS)
  return { ok: true, eventId }
}

/** GET /api/admin/organizers */
export async function getOrganizers() {
  await delay(FAKE_DELAY_MS)
  return organizers.map((o) => ({ ...o }))
}

/**
 * GET /api/admin/organizers/pending — optional separate call when wiring the API.
 * Not used by the mock UI yet; kept as a comment for the backend team.
 */

/** POST /api/admin/organizers/{id}/approve */
export async function approveOrganizer(organizerId) {
  await delay(FAKE_DELAY_MS)
  return { ok: true, organizerId }
}

/** POST /api/admin/organizers/{id}/reject */
export async function rejectOrganizer(organizerId) {
  await delay(FAKE_DELAY_MS)
  return { ok: true, organizerId }
}

/**
 * User directory for admin tables (mock).
 * Later: align with paginated admin or UserController endpoints.
 */
export async function getUsers() {
  await delay(FAKE_DELAY_MS)
  return users.map((u) => ({ ...u }))
}
