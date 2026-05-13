import { useEffect, useMemo, useState } from 'react'

import AdminOrganizerTable from '../components/AdminOrganizerTable.jsx'
import {
  approveOrganizer as approveOrganizerApi,
  getOrganizers,
  rejectOrganizer as rejectOrganizerApi,
} from '../services/adminService.js'

function countByStatus(rows, status) {
  return rows.filter((r) => r.status === status).length
}

/**
 * Manage Organizers — mock list + local status updates after approve/reject.
 */
export default function ManageOrganizers() {
  const [organizers, setOrganizers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const rows = await getOrganizers()
        if (active) setOrganizers(rows.map((o) => ({ ...o })))
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
      pendingCount: countByStatus(organizers, 'Pending'),
      approvedCount: countByStatus(organizers, 'Approved'),
      rejectedCount: countByStatus(organizers, 'Rejected'),
    }),
    [organizers],
  )

  async function handleApprove(organizerId) {
    await approveOrganizerApi(organizerId)
    setOrganizers((prev) =>
      prev.map((o) => (String(o.id) === String(organizerId) ? { ...o, status: 'Approved' } : o)),
    )
  }

  async function handleReject(organizerId) {
    await rejectOrganizerApi(organizerId)
    setOrganizers((prev) =>
      prev.map((o) => (String(o.id) === String(organizerId) ? { ...o, status: 'Rejected' } : o)),
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Manage organizers</h1>
        <p className="admin-page__lead">Review organizer registrations.</p>
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
        <p className="admin-muted">Loading organizers…</p>
      ) : (
        <AdminOrganizerTable
          organizers={organizers}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  )
}
