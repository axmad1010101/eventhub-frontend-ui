import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="EventHub home">
          EventHub
        </Link>

        <nav className="navbar__nav" aria-label="Main navigation">
          <div className="navbar__links">
            {/* `NavLink` lets us style the active link automatically */}
            <NavLink to="/" end className="navbar__link">
              Home
            </NavLink>
            <NavLink to="/watchlist" className="navbar__link">
              Watchlist
            </NavLink>
          </div>

          <div className="navbar__auth">
            {/* Real client-side routes; auth itself is not wired to a backend yet. */}
            <NavLink to="/login" className="navbar__link navbar__link--quiet">
              Login
            </NavLink>
            <NavLink to="/signup" className="navbar__signup">
              Sign Up
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  )
}
