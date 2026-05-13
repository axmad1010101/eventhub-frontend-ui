import { NavLink } from 'react-router-dom'

/**
 * Left navigation for the admin area.
 * Uses NavLink so the active route gets an extra class for styling.
 */
export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__brand-title">EventHub</span>
        <span className="admin-sidebar__brand-sub">Admin</span>
      </div>

      <nav className="admin-sidebar__nav">
        <NavLink to="/admin" end className="admin-sidebar__link">
          Dashboard
        </NavLink>
        <NavLink to="/admin/events" className="admin-sidebar__link">
          Events
        </NavLink>
        <NavLink to="/admin/organizers" className="admin-sidebar__link">
          Organizers
        </NavLink>
        <NavLink to="/admin/users" className="admin-sidebar__link">
          Users
        </NavLink>
      </nav>

      <div className="admin-sidebar__footer">
        <NavLink to="/" className="admin-sidebar__link admin-sidebar__link--back">
          Back to Site
        </NavLink>
      </div>
    </aside>
  )
}
