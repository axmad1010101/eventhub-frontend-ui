/**
 * Metric tile for organizer dashboard and analytics pages.
 */
export default function OrganizerStatsCard({ title, value, hint }) {
  return (
    <article className="organizer-stat-card">
      <h3 className="organizer-stat-card__title">{title}</h3>
      <p className="organizer-stat-card__value">{value}</p>
      {hint ? <p className="organizer-stat-card__hint">{hint}</p> : null}
    </article>
  )
}
