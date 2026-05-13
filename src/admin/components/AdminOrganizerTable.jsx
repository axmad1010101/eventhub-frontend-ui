function statusBadgeClass(status) {
  const s = String(status).toLowerCase()
  if (s === 'pending') return 'admin-badge admin-badge--pending'
  if (s === 'approved') return 'admin-badge admin-badge--approved'
  if (s === 'rejected') return 'admin-badge admin-badge--rejected'
  return 'admin-badge'
}

function formatSubmittedAt(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

export default function AdminOrganizerTable({ organizers, onApprove, onReject }) {
  if (!organizers.length) {
    return <p className="admin-empty">No organizers to display.</p>
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Phone number</th>
            <th>Submitted at</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizers.map((row) => {
            const isPending = row.status === 'Pending'
            return (
              <tr key={row.id}>
                <td data-label="Name">{row.name}</td>
                <td data-label="Email">{row.email}</td>
                <td data-label="Organization">{row.organizationName}</td>
                <td data-label="Phone">{row.phoneNumber}</td>
                <td data-label="Submitted">{formatSubmittedAt(row.submittedAt)}</td>
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
