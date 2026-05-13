import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="EventHub Tickets home">
          <span className="navbar__brand-mark" aria-hidden />
          <span className="navbar__brand-text">
            <span className="navbar__brand-name">Event Hub</span>
            <span className="navbar__brand-suffix">Tickets</span>
          </span>
        </Link>

        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLink to="/" end className="navbar__link">
            Events
          </NavLink>
          <NavLink to="/watchlist" className="navbar__link">
            Watchlist
          </NavLink>
          <NavLink to="/login" className="navbar__link">
            Login
          </NavLink>
          <NavLink to="/signup" className="navbar__signup">
            Sign Up
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
