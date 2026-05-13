import { Outlet } from 'react-router-dom'

import Navbar from './Navbar.jsx'

export default function ParticipantLayout() {
  return (
    <>
      <Navbar />
      <main className="page-container">
        <Outlet />
      </main>
    </>
  )
}
