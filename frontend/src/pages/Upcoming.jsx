import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Heart, ArrowRight } from 'lucide-react';
import GameCard from '../components/games/GameCard';
import { gameService } from '../services/gameService';
import { formatDate, parseDate } from '../utils/date';

export default function Upcoming() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUpcoming() {
      try {
        const data = await gameService.getUpcoming(16);
        setGames(data || []);
      } catch (err) {
        console.error('Failed to load upcoming games:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUpcoming();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-tag" style={{ color: 'var(--accent-cyan)' }}>
          <Calendar size={14} style={{ display: 'inline', verticalAlign: '-1px' }} /> Roadmap Ahead
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Upcoming Indie Releases
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
          Chronologically sorted future releases. Track upcoming titles and add them to your wishlist to receive updates on launch day.
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
          <Calendar size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No upcoming games scheduled right now</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Check back soon as developers submit new titles to the hub.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {games.map((game) => {
            const dateObj = parseDate(game.release_date);
            const monthStr = dateObj ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj).toUpperCase() : 'TBA';
            const dayStr = dateObj ? dateObj.getDate() : '--';
            const yearStr = dateObj ? dateObj.getFullYear() : '';

            return (
              <div
                key={game.id}
                className="card"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  padding: '1.25rem',
                  gap: '1.5rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  transition: 'border-color 0.2s ease, transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '85px',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--accent-cyan-glow)',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>
                    {monthStr}
                  </span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.1, color: '#ffffff' }}>
                    {dayStr}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {yearStr}
                  </span>
                </div>

                <div style={{ width: '160px', aspectRatio: '16/9', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={game.cover_image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80'}
                    alt={game.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <a href={`/games/${game.slug}`} style={{ color: 'var(--text-primary)' }}>
                      {game.title}
                    </a>
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                    Developed by <strong>{game.developer_name || 'Independent Studio'}</strong>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {game.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
                  <a href={`/games/${game.slug}`} className="btn btn-secondary btn-sm">
                    View Details <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
