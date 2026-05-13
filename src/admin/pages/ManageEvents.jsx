import { useEffect, useMemo, useState } from 'react'

import AdminEventTable from '../components/AdminEventTable.jsx'
import {
  approveEvent as approveEventApi,
  getPendingEvents,
  rejectEvent as rejectEventApi,
} from '../services/adminService.js'

/**
 * Compute how many events are in each status bucket (based on current table state).
 */
function countByStatus(events, status) {
  return events.filter((e) => e.status === status).length
}

/**
 * Manage Events — list comes from adminService; approve/reject update React state only (mock).
 */
export default function ManageEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const rows = await getPendingEvents()
        if (active) setEvents(rows.map((e) => ({ ...e })))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const { pendingCount, approvedCount, rejectedCount } = useMemo(
    () => ({
      pendingCount: countByStatus(events, 'Pending'),
      approvedCount: countByStatus(events, 'Approved'),
      rejectedCount: countByStatus(events, 'Rejected'),
    }),
    [events],
  )

  async function handleApprove(eventId) {
    await approveEventApi(eventId)
    setEvents((prev) =>
      prev.map((e) => (String(e.id) === String(eventId) ? { ...e, status: 'Approved' } : e)),
    )
  }

  async function handleReject(eventId) {
    await rejectEventApi(eventId)
    setEvents((prev) =>
      prev.map((e) => (String(e.id) === String(eventId) ? { ...e, status: 'Rejected' } : e)),
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Manage events</h1>
        <p className="admin-page__lead">Review submitted events. Approve or reject pending items.</p>
      </header>

      <div className="admin-summary-row">
        <div className="admin-summary-card">
          <span className="admin-summary-card__label">Pending</span>
          <span className="admin-summary-card__value">{pendingCount}</span>
        </div>
        <div className="admin-summary-card">
          <span className="admin-summary-card__label">Approved</span>
          <span className="admin-summary-card__value">{approvedCount}</span>
        </div>
        <div className="admin-summary-card">
          <span className="admin-summary-card__label">Rejected</span>
          <span className="admin-summary-card__value">{rejectedCount}</span>
        </div>
      </div>

      {loading ? (
        <p className="admin-muted">Loading events…</p>
      ) : (
        <AdminEventTable events={events} onApprove={handleApprove} onReject={handleReject} />
      )}
    </div>
  )
}
