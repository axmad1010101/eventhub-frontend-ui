import { Link } from 'react-router-dom'

function statusBadgeClass(status) {
  const s = String(status).toLowerCase()
  if (s === 'pending') return 'organizer-badge organizer-badge--pending'
  if (s === 'approved') return 'organizer-badge organizer-badge--approved'
  if (s === 'rejected') return 'organizer-badge organizer-badge--rejected'
  return 'organizer-badge'
}

function formatMoney(n) {
  return `${new Intl.NumberFormat().format(Number(n) || 0)} EGP`
}

/**
 * Table of the organizer’s own events with edit + delete actions.
 */
export default function OrganizerEventTable({ events, onDelete }) {
  if (!events.length) {
    return <p className="organizer-muted">No events match your filters.</p>
  }

  return (
    <div className="organizer-table-wrap">
      <table className="organizer-table">
        <thead>
          <tr>
            <th>Event title</th>
            <th>Category</th>
            <th>Venue</th>
            <th>Date</th>
            <th>Ticket price</th>
            <th>Tickets sold</th>
            <th>Revenue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((row) => (
            <tr key={row.id}>
              <td data-label="Title">{row.title}</td>
              <td data-label="Category">{row.category}</td>
              <td data-label="Venue">{row.venue}</td>
              <td data-label="Date">{row.date}</td>
              <td data-label="Price">{formatMoney(row.ticketPrice)}</td>
              <td data-label="Sold">{row.ticketsSold}</td>
              <td data-label="Revenue">{formatMoney(row.revenue)}</td>
              <td data-label="Status">
                <span className={statusBadgeClass(row.status)}>{row.status}</span>
              </td>
              <td data-label="Actions" className="organizer-table__actions">
                <div className="organizer-table__btn-row">
                  <Link to={`/organizer/events/${row.id}/edit`} className="organizer-btn organizer-btn--ghost">
                    View / Edit
                  </Link>
                  <button type="button" className="organizer-btn organizer-btn--danger" onClick={() => onDelete(row.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
