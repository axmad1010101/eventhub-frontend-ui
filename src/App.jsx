import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar.jsx'
import EventDetailsPage from './pages/EventDetailsPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import WatchlistPage from './pages/WatchlistPage.jsx'

function App() {
  return (
    // `BrowserRouter` enables client-side routing (no full page reloads).
    // `Routes` + `Route` map URL paths to React components.
    <BrowserRouter>
      {/* Navbar should show on all pages, so it lives outside <Routes>. */}
      <Navbar />

      {/* Simple centered container for page content */}
      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
