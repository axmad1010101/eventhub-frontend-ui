import { useEffect, useState } from 'react'

import OrganizerStatsCard from '../components/OrganizerStatsCard.jsx'
import { getOrganizerAnalytics } from '../services/organizerService.js'

function formatInt(n) {
  return new Intl.NumberFormat().format(Number(n) || 0)
}

function formatMoney(n) {
  return `${formatInt(n)} EGP`
}

/**
 * Analytics — cards, performance table, top event, and ticket availability bars (mock).
 */
export default function OrganizerAnalytics() {
  const [bundle, setBundle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const data = await getOrganizerAnalytics()
        if (active) setBundle(data)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const stats = bundle?.stats

  const top = bundle?.topPerformingEvent
  const topTitle = top ? top.title : '—'
  const topRevenue = top ? top.revenue : 0

  if (loading) {
    return (
      <div className="organizer-page">
        <p className="organizer-muted">Loading analytics…</p>
      </div>
    )
  }

  if (!stats || !bundle) {
    return (
      <div className="organizer-page">
        <p className="organizer-muted">Could not load analytics.</p>
      </div>
    )
  }

  return (
    <div className="organizer-page">
      <header className="organizer-page__header">
        <h1 className="organizer-page__title">Analytics</h1>
        <p className="organizer-page__lead">Revenue, tickets, and performance across your events.</p>
      </header>

      <div className="organizer-stat-grid">
        <OrganizerStatsCard title="Total revenue" value={formatMoney(stats.totalRevenue)} />
        <OrganizerStatsCard title="Tickets sold" value={formatInt(stats.ticketsSold)} />
        <OrganizerStatsCard
          title="Average rating"
          value={stats.averageRating ? stats.averageRating.toFixed(2) : '—'}
        />
        <OrganizerStatsCard title="Approved events" value={formatInt(stats.approvedEvents)} />
        <OrganizerStatsCard title="Pending events" value={formatInt(stats.pendingEvents)} />
        <OrganizerStatsCard title="Upcoming events" value={formatInt(stats.upcomingEvents)} />
      </div>

      <div className="organizer-analytics-grid">
        <section className="organizer-panel">
          <h2 className="organizer-panel__title">Top performing event</h2>
          <p className="organizer-top-event__title">{topTitle}</p>
          <p className="organizer-top-event__revenue">{formatMoney(topRevenue)}</p>
          <p className="organizer-muted organizer-top-event__hint">Based on highest revenue in your current list.</p>
        </section>

        <section className="organizer-panel organizer-panel--wide">
          <h2 className="organizer-panel__title">Ticket availability</h2>
          <p className="organizer-muted organizer-panel__subtitle">Share of tickets sold per event.</p>
          <ul className="organizer-availability-list">
            {bundle.ticketAvailability.map((row) => (
              <li key={row.id} className="organizer-availability-list__item">
                <div className="organizer-availability-list__head">
                  <span className="organizer-availability-list__title">{row.title}</span>
                  <span className="organizer-availability-list__pct">{row.percentSold}% sold</span>
                </div>
                <div className="organizer-progress" role="presentation">
                  <div className="organizer-progress__fill" style={{ width: `${Math.min(100, row.percentSold)}%` }} />
                </div>
                <p className="organizer-availability-list__meta">
                  {row.ticketsSold} / {row.totalTickets} tickets
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="organizer-panel organizer-panel--table">
        <h2 className="organizer-panel__title">Event performance</h2>
        <div className="organizer-table-wrap">
          <table className="organizer-table">
            <thead>
              <tr>
                <th>Event title</th>
                <th>Status</th>
                <th>Tickets sold</th>
                <th>Available tickets</th>
                <th>Total tickets</th>
                <th>Revenue</th>
                <th>Average rating</th>
              </tr>
            </thead>
            <tbody>
              {bundle.events.map((e) => (
                <tr key={e.id}>
                  <td data-label="Title">{e.title}</td>
                  <td data-label="Status">{e.status}</td>
                  <td data-label="Sold">{e.ticketsSold}</td>
                  <td data-label="Available">{e.availableTickets}</td>
                  <td data-label="Total">{e.totalTickets}</td>
                  <td data-label="Revenue">{formatMoney(e.revenue)}</td>
                  <td data-label="Rating">{e.averageRating ? e.averageRating.toFixed(1) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
