import React from 'react';
import { Filter, X, Search, SlidersHorizontal } from 'lucide-react';

export default function GameFilters({
  filters,
  onChange,
  onReset,
  genres = [],
  platforms = []
}) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.genre || filters.platform || filters.minRating || filters.maxPrice
  );

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        marginBottom: '2rem',
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Filter title or keyword..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
          />
        </div>

        <div>
          <select
            value={filters.genre || ''}
            onChange={(e) => handleChange('genre', e.target.value)}
            className="form-select"
            style={{ fontSize: '0.875rem' }}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id || g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filters.platform || ''}
            onChange={(e) => handleChange('platform', e.target.value)}
            className="form-select"
            style={{ fontSize: '0.875rem' }}
          >
            <option value="">All Platforms</option>
            {platforms.map((p) => (
              <option key={p.id || p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filters.minRating || ''}
            onChange={(e) => handleChange('minRating', e.target.value)}
            className="form-select"
            style={{ fontSize: '0.875rem' }}
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5★ & Above (Exceptional)</option>
            <option value="4.0">4.0★ & Above (Great)</option>
            <option value="3.0">3.0★ & Above (Good)</option>
          </select>
        </div>

        <div>
          <select
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="form-select"
            style={{ fontSize: '0.875rem' }}
          >
            <option value="">Any Price</option>
            <option value="0">Free to Play</option>
            <option value="15">Under $15</option>
            <option value="30">Under $30</option>
          </select>
        </div>

        <div>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="form-select"
            style={{ fontSize: '0.875rem', borderColor: 'var(--border-medium)' }}
          >
            <option value="newest">Recently Added</option>
            <option value="trending">Trending (7 Days)</option>
            <option value="rating">Top Rated</option>
            <option value="upcoming">Nearest Release</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <SlidersHorizontal size={14} /> Active filters applied
          </div>
          <button
            type="button"
            onClick={onReset}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.775rem', padding: '0.25rem 0.65rem' }}
          >
            <X size={13} /> Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
