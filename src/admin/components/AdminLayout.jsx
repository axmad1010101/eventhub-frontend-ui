import { Outlet } from 'react-router-dom'

import AdminSidebar from './AdminSidebar.jsx'
import '../styles/admin.css'

/**
 * Admin shell: fixed sidebar + nested route content.
 * Child routes render inside <Outlet /> (see App.jsx).
 */
export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__main">
        <Outlet />
      </div>
    </div>
  )
}
