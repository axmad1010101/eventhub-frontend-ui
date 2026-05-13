/** Human-readable role label for the table (backend may send EventOrganizer). */
function formatRole(role) {
  if (role === 'EventOrganizer') return 'Organizer'
  return role
}

function statusBadgeClass(status) {
  const s = String(status).toLowerCase()
  if (s === 'pending') return 'admin-badge admin-badge--pending'
  if (s === 'approved' || s === 'active') return 'admin-badge admin-badge--approved'
  if (s === 'rejected' || s === 'inactive') return 'admin-badge admin-badge--rejected'
  return 'admin-badge'
}

function formatCreatedAt(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
  } catch {
    return iso
  }
}

export default function AdminUserTable({ users }) {
  if (!users.length) {
    return <p className="admin-empty">No users match your filters.</p>
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>
          {users.map((row) => (
            <tr key={row.id}>
              <td data-label="Name">{row.name}</td>
              <td data-label="Email">{row.email}</td>
              <td data-label="Role">{formatRole(row.role)}</td>
              <td data-label="Status">
                <span className={statusBadgeClass(row.status)}>{row.status}</span>
              </td>
              <td data-label="Created">{formatCreatedAt(row.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
