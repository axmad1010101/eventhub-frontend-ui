import { useEffect, useMemo, useState } from 'react'

import AdminUserTable from '../components/AdminUserTable.jsx'
import { getUsers } from '../services/adminService.js'

const ROLE_OPTIONS = ['All', 'Participant', 'EventOrganizer', 'Admin']
const STATUS_OPTIONS = ['All', 'Active', 'Pending', 'Approved', 'Rejected', 'Inactive']

/**
 * Client-side filters for the mock user directory.
 * Later the same UI can POST filter params to a paginated API.
 */
export default function ManageUsers() {
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const rows = await getUsers()
        if (active) setAllUsers(rows.map((u) => ({ ...u })))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allUsers.filter((u) => {
      const matchesSearch =
        q === '' ||
        String(u.name).toLowerCase().includes(q) ||
        String(u.email).toLowerCase().includes(q)
      const matchesRole = roleFilter === 'All' || u.role === roleFilter
      const matchesStatus = statusFilter === 'All' || u.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [allUsers, search, roleFilter, statusFilter])

  function clearFilters() {
    setSearch('')
    setRoleFilter('All')
    setStatusFilter('All')
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Manage users</h1>
        <p className="admin-page__lead">Search and filter the user directory.</p>
      </header>

      <div className="admin-filters">
        <label className="admin-field">
          <span className="admin-field__label">Search</span>
          <input
            className="admin-field__input"
            type="search"
            placeholder="Name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Role</span>
          <select className="admin-field__input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r === 'EventOrganizer' ? 'Organizer' : r}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span className="admin-field__label">Status</span>
          <select
            className="admin-field__input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <div className="admin-filters__actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      </div>

      <p className="admin-visible-count">
        Showing <strong>{filteredUsers.length}</strong> of {allUsers.length} users
      </p>

      {loading ? <p className="admin-muted">Loading users…</p> : <AdminUserTable users={filteredUsers} />}
    </div>
  )
}
