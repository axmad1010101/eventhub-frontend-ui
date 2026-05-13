import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Participant (public) — Navbar only inside ParticipantLayout, not global.
import ParticipantLayout from './components/ParticipantLayout.jsx'
// Admin — AdminLayout wraps AdminSidebar + nested pages via <Outlet />.
import AdminLayout from './admin/components/AdminLayout.jsx'
import AdminDashboard from './admin/pages/AdminDashboard.jsx'
import ManageEvents from './admin/pages/ManageEvents.jsx'
import ManageOrganizers from './admin/pages/ManageOrganizers.jsx'
import ManageUsers from './admin/pages/ManageUsers.jsx'
// Organizer — OrganizerLayout wraps OrganizerSidebar + nested pages via <Outlet />.
import OrganizerLayout from './organizer/components/OrganizerLayout.jsx'
import CreateEvent from './organizer/pages/CreateEvent.jsx'
import EditEvent from './organizer/pages/EditEvent.jsx'
import OrganizerAnalytics from './organizer/pages/OrganizerAnalytics.jsx'
import OrganizerDashboard from './organizer/pages/OrganizerDashboard.jsx'
import OrganizerEvents from './organizer/pages/OrganizerEvents.jsx'
import EventDetailsPage from './pages/EventDetailsPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- Participant ---------- */}
        <Route element={<ParticipantLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        {/* ---------- Admin ---------- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="organizers" element={<ManageOrganizers />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* ---------- Organizer (more specific path before /organizer/events) ---------- */}
        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route index element={<OrganizerDashboard />} />
          <Route path="events/:id/edit" element={<EditEvent />} />
          <Route path="events" element={<OrganizerEvents />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="analytics" element={<OrganizerAnalytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
