/** Map internal status strings to CSS modifier classes for colored badges. */
function statusBadgeClass(status) {
  const s = String(status).toLowerCase()
  if (s === 'pending') return 'admin-badge admin-badge--pending'
  if (s === 'approved' || s === 'active') return 'admin-badge admin-badge--approved'
  if (s === 'rejected' || s === 'inactive') return 'admin-badge admin-badge--rejected'
  return 'admin-badge'
}

/**
 * Table of events for admin review.
 * `onApprove` / `onReject` are called with the row id when buttons are pressed.
 */
export default function AdminEventTable({ events, onApprove, onReject }) {
  if (!events.length) {
    return <p className="admin-empty">No events to display.</p>
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Event title</th>
            <th>Organizer</th>
            <th>Category</th>
            <th>Venue</th>
            <th>Date</th>
            <th>Ticket price</th>
            <th>Tickets</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((row) => {
            const isPending = row.status === 'Pending'
            return (
              <tr key={row.id}>
                <td data-label="Title">{row.title}</td>
                <td data-label="Organizer">{row.organizerName}</td>
                <td data-label="Category">{row.category}</td>
                <td data-label="Venue">{row.venue}</td>
                <td data-label="Date">{row.date}</td>
                <td data-label="Price">{row.ticketPrice} EGP</td>
                <td data-label="Tickets">
                  {row.availableTickets} / {row.totalTickets}
                </td>
                <td data-label="Status">
                  <span className={statusBadgeClass(row.status)}>{row.status}</span>
                </td>
                <td data-label="Actions" className="admin-table__actions">
                  {isPending ? (
                    <div className="admin-table__btn-row">
                      <button type="button" className="admin-btn admin-btn--approve" onClick={() => onApprove(row.id)}>
                        Approve
                      </button>
                      <button type="button" className="admin-btn admin-btn--reject" onClick={() => onReject(row.id)}>
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="admin-muted">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
