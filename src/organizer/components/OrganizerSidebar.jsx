import { NavLink } from 'react-router-dom'

/**
 * Left navigation for the organizer portal.
 */
export default function OrganizerSidebar() {
  return (
    <aside className="organizer-sidebar" aria-label="Organizer navigation">
      <div className="organizer-sidebar__brand">
        <span className="organizer-sidebar__brand-title">EventHub</span>
        <span className="organizer-sidebar__brand-sub">Organizer</span>
      </div>

      <nav className="organizer-sidebar__nav">
        <NavLink to="/organizer" end className="organizer-sidebar__link">
          Dashboard
        </NavLink>
        <NavLink to="/organizer/events" className="organizer-sidebar__link">
          My events
        </NavLink>
        <NavLink to="/organizer/create-event" className="organizer-sidebar__link">
          Create event
        </NavLink>
        <NavLink to="/organizer/analytics" className="organizer-sidebar__link">
          Analytics
        </NavLink>
      </nav>

      <div className="organizer-sidebar__footer">
        <NavLink to="/" className="organizer-sidebar__link organizer-sidebar__link--back">
          Back to Site
        </NavLink>
      </div>
    </aside>
  )
}
