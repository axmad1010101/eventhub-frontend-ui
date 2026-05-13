import { Outlet } from 'react-router-dom'

import OrganizerSidebar from './OrganizerSidebar.jsx'
import '../styles/organizer.css'

/**
 * Organizer shell: sidebar + nested routes via <Outlet />.
 */
export default function OrganizerLayout() {
  return (
    <div className="organizer-layout">
      <OrganizerSidebar />
      <div className="organizer-layout__main">
        <Outlet />
      </div>
    </div>
  )
}
