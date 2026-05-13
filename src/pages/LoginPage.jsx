import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  // Local form state. We track inputs so the page feels real even though
  // there's no backend wired up yet.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // The form's onSubmit fires on click AND when the user presses Enter.
  // We call preventDefault so the browser doesn't reload the page.
  function handleSubmit(event) {
    event.preventDefault()
    alert('Thanks — your login request was received.')
  }

  return (
    <section className="page auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <h1 className="auth-card__title">Login</h1>
          <p className="auth-card__subtitle">
            Welcome back. Sign in to continue browsing events.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="field__control"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="field__control"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn-book btn-book--block">
            Login
          </button>
        </form>

        <p className="auth-card__notice">You can browse and book events without signing in.</p>

        <p className="auth-card__alt">
          Don&apos;t have an account?{' '}
          <Link className="auth-card__link" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  )
}
