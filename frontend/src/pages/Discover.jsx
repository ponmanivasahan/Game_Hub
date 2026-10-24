import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameCard from '../components/games/GameCard';
import GameFilters from '../components/games/GameFilters';
import { gameService } from '../services/gameService';
import { Compass, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [games, setGames] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const filters = {
    search: searchParams.get('search') || '',
    genre: searchParams.get('genre') || '',
    platform: searchParams.get('platform') || '',
    minRating: searchParams.get('minRating') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  };

  useEffect(() => {
    async function loadMetadata() {
      try {
        const meta = await gameService.getMetadata();
        setGenres(meta.genres || []);
        setPlatforms(meta.platforms || []);
      } catch (err) {
        console.error('Failed to load metadata:', err);
      }
    }
    loadMetadata();
  }, []);

  useEffect(() => {
    async function loadGames() {
      setLoading(true);
      try {
        const data = await gameService.getGames({
          ...filters,
          limit: 12
        });
        setGames(data.games || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch games:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.set(key, String(val));
      }
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="section-tag">
          <Compass size={13} style={{ display: 'inline', verticalAlign: '-1px' }} /> Catalog Explorer
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Discover Indie Games
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Explore our complete library of independent titles, filtered by genre, mechanics, and release window.
        </p>
      </div>

      <GameFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        genres={genres}
        platforms={platforms}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <span>Showing <strong>{games.length}</strong> of <strong>{total}</strong> games</span>
        {filters.genre && <span>Filtered by: <strong>{filters.genre}</strong></span>}
      </div>

      {loading ? (
        <div className="grid-games">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card skeleton" style={{ height: '340px' }} />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <Compass size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No games found matching your filters</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Try expanding your price range, choosing another genre, or clearing the search keyword.
          </p>
          <button type="button" onClick={handleResetFilters} className="btn btn-primary btn-sm">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-games">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '3rem' }}>
          <button
            type="button"
            disabled={filters.page <= 1}
            onClick={() => handlePageChange(filters.page - 1)}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Page {filters.page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={filters.page >= totalPages}
            onClick={() => handlePageChange(filters.page + 1)}
            className="btn btn-secondary btn-sm"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
