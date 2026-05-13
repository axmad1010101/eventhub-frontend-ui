/**
 * Simple stat tile for the admin dashboard.
 * `value` can be a number or a pre-formatted string (e.g. revenue).
 */
export default function AdminStatsCard({ title, value, hint }) {
  return (
    <article className="admin-stat-card">
      <h3 className="admin-stat-card__title">{title}</h3>
      <p className="admin-stat-card__value">{value}</p>
      {hint ? <p className="admin-stat-card__hint">{hint}</p> : null}
    </article>
  )
}
