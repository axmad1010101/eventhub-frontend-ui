import { useEffect, useState } from 'react'

import AdminStatsCard from '../components/AdminStatsCard.jsx'
import { getAdminStats } from '../services/adminService.js'

/** Format large integers with grouping (e.g. ticket counts). */
function formatInt(n) {
  return new Intl.NumberFormat().format(Number(n) || 0)
}

/** Format mock revenue in EGP (no decimals for big round numbers). */
function formatRevenue(n) {
  return `${formatInt(n)} EGP`
}

/**
 * Admin home: high-level numbers from adminService (mock today).
 * Later: same layout, data from GET /api/admin/dashboard-stats.
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const data = await getAdminStats()
        if (active) setStats(data)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-muted">Loading dashboard…</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="admin-page">
        <p className="admin-muted">Could not load stats.</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Dashboard</h1>
        <p className="admin-page__lead">Overview of users, organizers, and events on the platform.</p>
      </header>

      <div className="admin-stat-grid">
        <AdminStatsCard title="Total users" value={formatInt(stats.totalUsers)} />
        <AdminStatsCard title="Organizers" value={formatInt(stats.totalOrganizers)} />
        <AdminStatsCard title="Pending organizers" value={formatInt(stats.pendingOrganizers)} />
        <AdminStatsCard title="Total events" value={formatInt(stats.totalEvents)} />
        <AdminStatsCard title="Pending events" value={formatInt(stats.pendingEvents)} />
        <AdminStatsCard title="Approved events" value={formatInt(stats.approvedEvents)} />
        <AdminStatsCard title="Tickets sold" value={formatInt(stats.ticketsSold)} />
        <AdminStatsCard title="Total revenue" value={formatRevenue(stats.totalRevenue)} hint="Cumulative ticket sales" />
      </div>
    </div>
  )
}
