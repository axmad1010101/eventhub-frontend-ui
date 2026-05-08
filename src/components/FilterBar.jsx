export default function FilterBar({
  selectedCategory,
  setSelectedCategory,
  selectedVenue,
  setSelectedVenue,
  searchTerm,
  setSearchTerm,
  categories,
  venues,
}) {
  // This component is reusable: it doesn't own the data.
  // It receives values (selectedCategory, searchTerm, ...) and setter functions via props.

  function handleClear() {
    // Reset all filters back to default values.
    // Because the inputs are controlled by state in HomePage, the UI updates instantly.
    setSearchTerm('')
    setSelectedCategory('All')
    setSelectedVenue('All')
  }

  return (
    <section className="filter-bar" aria-label="Event filters">
      <div className="filter-grid">
        <label className="field">
          <span className="field__label">Search</span>
          <input
            className="field__control"
            type="text"
            value={searchTerm}
            placeholder="Search by title..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Category</span>
          <select
            className="field__control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Venue</span>
          <select
            className="field__control"
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
          >
            <option value="All">All Venues</option>
            {venues.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <div className="filter-actions">
          <button type="button" className="btn-link" onClick={handleClear}>
            Clear Filters
          </button>
        </div>
      </div>
    </section>
  )
}

