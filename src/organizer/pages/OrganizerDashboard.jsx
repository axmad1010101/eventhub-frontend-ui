import { useEffect, useState } from 'react'

import OrganizerStatsCard from '../components/OrganizerStatsCard.jsx'
import { getOrganizerRecentActivity, getOrganizerStats } from '../services/organizerService.js'

function formatInt(n) {
  return new Intl.NumberFormat().format(Number(n) || 0)
}

function formatMoney(n) {
  return `${formatInt(n)} EGP`
}

function formatActivityDate(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

/**
 * Organizer home — stats from organizerService + recent activity feed (mock).
 */
export default function OrganizerDashboard() {
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const [s, a] = await Promise.all([getOrganizerStats(), getOrganizerRecentActivity()])
        if (active) {
          setStats(s)
          setActivity(a)
        }
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
      <div className="organizer-page">
        <p className="organizer-muted">Loading dashboard…</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="organizer-page">
        <p className="organizer-muted">Could not load stats.</p>
      </div>
    )
  }

  return (
    <div className="organizer-page">
      <header className="organizer-page__header">
        <h1 className="organizer-page__title">Dashboard</h1>
        <p className="organizer-page__lead">Snapshot of your events, sales, and ratings.</p>
      </header>

      <div className="organizer-stat-grid">
        <OrganizerStatsCard title="Total events" value={formatInt(stats.totalEvents)} />
        <OrganizerStatsCard title="Approved events" value={formatInt(stats.approvedEvents)} />
        <OrganizerStatsCard title="Pending events" value={formatInt(stats.pendingEvents)} />
        <OrganizerStatsCard title="Tickets sold" value={formatInt(stats.ticketsSold)} />
        <OrganizerStatsCard title="Total revenue" value={formatMoney(stats.totalRevenue)} />
        <OrganizerStatsCard
          title="Average rating"
          value={stats.averageRating ? stats.averageRating.toFixed(2) : '—'}
          hint="Across events with reviews"
        />
        <OrganizerStatsCard title="Upcoming events" value={formatInt(stats.upcomingEvents)} hint="From today onward" />
      </div>

      <section className="organizer-panel organizer-panel--activity">
        <h2 className="organizer-panel__title">Recent activity</h2>
        <ul className="organizer-activity-list">
          {activity.map((item) => (
            <li key={item.id} className="organizer-activity-list__item">
              <span className="organizer-activity-list__type">{item.type}</span>
              <span className="organizer-activity-list__message">{item.message}</span>
              <time className="organizer-activity-list__date" dateTime={item.date}>
                {formatActivityDate(item.date)}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
