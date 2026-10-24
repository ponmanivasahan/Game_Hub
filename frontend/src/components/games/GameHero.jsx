import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Calendar, ArrowRight, Sparkles, Gamepad2 } from 'lucide-react';
import { getReleaseInfo } from '../../utils/date';
import PlayableDemoModal from './PlayableDemoModal';

export default function GameHero({ game }) {
  const [demoOpen, setDemoOpen] = useState(false);

  if (!game) return null;

  const release = getReleaseInfo(game.release_date);
  const coverUrl = game.cover_image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80';

  return (
    <>
      <section
        style={{
          position: 'relative',
          minHeight: '520px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            filter: 'brightness(0.35) blur(1px)',
            transform: 'scale(1.02)'
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(9,10,15,0.98) 0%, rgba(9,10,15,0.7) 50%, rgba(9,10,15,0.85) 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(139,92,246,0.18) 0%, transparent 60%)'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <span className="badge badge-featured">
                <Sparkles size={13} /> Spotlight Indie
              </span>
              <span className={`badge ${release.isUpcoming ? 'badge-upcoming' : 'badge-released'}`}>
                <Calendar size={13} /> {release.label}
              </span>
              {game.playable_demo_url && (
                <span className="badge badge-cyan">
                  <Gamepad2 size={13} /> Web Demo Playable
                </span>
              )}
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
                color: '#ffffff'
              }}
            >
              {game.title}
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: '1.6',
                color: '#cbd5e1',
                marginBottom: '1.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {game.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Star size={18} fill="#fbbf24" stroke="#fbbf24" />
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  {Number(game.average_rating) > 0 ? Number(game.average_rating).toFixed(1) : 'New'}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ({game.review_count} player reviews)
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Developer: <strong style={{ color: '#ffffff' }}>{game.developer_name || 'Team Cherry'}</strong>
              </div>

              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {Number(game.steam_price) > 0 ? `$${Number(game.steam_price).toFixed(2)}` : 'Free to Play'}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="btn btn-fire btn-lg"
              >
                <Gamepad2 size={20} />
                <span>Play Web Demo</span>
              </button>

              <Link to={`/games/${game.slug}`} className="btn btn-secondary btn-lg">
                <span>Game Details</span>
                <ArrowRight size={18} />
              </Link>

              {game.trailer_url && (
                <a
                  href={game.trailer_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-lg"
                >
                  <Play size={18} fill="#ffffff" />
                  <span>Trailer</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <PlayableDemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        gameTitle={game.title}
        demoUrl={game.playable_demo_url}
      />
    </>
  );
}
