import React, { useState, useEffect } from 'react';
import { Heart, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameCard from '../components/games/GameCard';
import { favoriteService } from '../services/favoriteService';

export default function Favorites() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    setLoading(true);
    try {
      const data = await favoriteService.getMyFavorites({ limit: 50 });
      setGames(data.games || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleFavoriteToggle = (gameId, isFav) => {
    if (!isFav) {
      setGames(prev => prev.filter(g => g.id !== gameId));
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-tag" style={{ color: 'var(--color-danger)' }}>
          <Heart size={14} style={{ display: 'inline', verticalAlign: '-1px' }} /> Wishlist Collection
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          My Saved Games
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Games you are currently tracking for future purchases, DLC updates, or release dates.
        </p>
      </div>

      {loading ? (
        <div className="grid-games">
          {[...Array(4)].map((_, i) => (
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
          <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Click the heart icon on any game card or detail page to save it to your personal collection.
          </p>
          <Link to="/discover" className="btn btn-primary">
            <Compass size={16} /> Explore Games
          </Link>
        </div>
      ) : (
        <div className="grid-games">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={{ ...game, is_favorite: true }}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
