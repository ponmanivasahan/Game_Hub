import React, { useState, useEffect } from 'react';
import { Flame, Info, MessageSquare, TrendingUp } from 'lucide-react';
import GameCard from '../components/games/GameCard';
import { gameService } from '../services/gameService';

export default function Trending() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      try {
        const data = await gameService.getTrending(12);
        setGames(data || []);
      } catch (err) {
        console.error('Failed to load trending games:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-tag" style={{ color: '#f97316' }}>
          <Flame size={14} style={{ display: 'inline', verticalAlign: '-1px' }} /> Weekly Telemetry
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Trending Indie Games
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
          Real-time leaderboard calculated strictly from player reviews submitted during the previous 7 days.
        </p>

        <div
          style={{
            marginTop: '1.25rem',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(249, 115, 22, 0.08)',
            border: '1px solid rgba(249, 115, 22, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.85rem',
            color: '#fdba74'
          }}
        >
          <Info size={16} flexShrink={0} />
          <span>
            Rankings update dynamically based on verified community review momentum over the last 7 rolling days.
          </span>
        </div>
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
          <TrendingUp size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No trending games this week yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Be the first gamer to write a review and propel an indie game to the top of the leaderboard!
          </p>
        </div>
      ) : (
        <div className="grid-games">
          {games.map((game, idx) => (
            <div key={game.id} style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  zIndex: 20,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: idx === 0 ? '#f97316' : idx === 1 ? 'var(--accent-purple)' : 'var(--bg-card)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  border: '2px solid var(--bg-primary)'
                }}
              >
                #{idx + 1}
              </div>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
