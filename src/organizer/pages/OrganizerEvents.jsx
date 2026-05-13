import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import OrganizerEventTable from '../components/OrganizerEventTable.jsx'
import { deleteOrganizerEvent, getOrganizerEvents } from '../services/organizerService.js'

const STATUS_OPTIONS = ['All', 'Pending', 'Approved', 'Rejected']

/**
 * My Events — searchable list with delete (mock) and link to create flow.
 */
export default function OrganizerEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const rows = await getOrganizerEvents()
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

  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [events])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return events.filter((e) => {
      const matchesSearch =
        q === '' ||
        String(e.title).toLowerCase().includes(q) ||
        String(e.venue).toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter
      const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [events, search, statusFilter, categoryFilter])

  function clearFilters() {
    setSearch('')
    setStatusFilter('All')
    setCategoryFilter('All')
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this event from your list? You can add a new event later if needed.')) {
      return
    }
    const res = await deleteOrganizerEvent(id)
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => String(e.id) !== String(id)))
    }
  }

  return (
    <div className="organizer-page">
      <header className="organizer-page__header organizer-page__header--row">
        <div>
          <h1 className="organizer-page__title">My events</h1>
          <p className="organizer-page__lead">Manage drafts, live events, and past submissions.</p>
        </div>
        <Link to="/organizer/create-event" className="organizer-btn organizer-btn--primary">
          Create new event
        </Link>
      </header>

      <div className="organizer-filters">
        <label className="organizer-field">
          <span className="organizer-field__label">Search</span>
          <input
            className="organizer-field__input"
            type="search"
            placeholder="Title or venue"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className="organizer-field">
          <span className="organizer-field__label">Status</span>
          <select className="organizer-field__input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="organizer-field">
          <span className="organizer-field__label">Category</span>
          <select
            className="organizer-field__input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <div className="organizer-filters__actions">
          <button type="button" className="organizer-btn organizer-btn--ghost" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      </div>

      <p className="organizer-visible-count">
        Showing <strong>{filtered.length}</strong> of {events.length} events
      </p>

      {loading ? (
        <p className="organizer-muted">Loading events…</p>
      ) : (
        <OrganizerEventTable events={filtered} onDelete={handleDelete} />
      )}
    </div>
  )
}
