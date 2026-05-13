import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignUpPage() {
  // Local form state — no real registration yet, just UI behavior.
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Participant')

  function handleSubmit(event) {
    event.preventDefault()
    alert('Account request submitted.')
  }

  return (
    <section className="page auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <h1 className="auth-card__title">Create Account</h1>
          <p className="auth-card__subtitle">
            Join EventHub to save events and book tickets.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Name</span>
            <input
              className="field__control"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Role</span>
            <select
              className="field__control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Participant">Participant</option>
              <option value="Organizer">Organizer</option>
            </select>
          </label>

          <button type="submit" className="btn-book btn-book--block">
            Sign Up
          </button>
        </form>

        <p className="auth-card__notice">We will follow up by email when your account is ready.</p>

        <p className="auth-card__alt">
          Already have an account?{' '}
          <Link className="auth-card__link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}
