import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Code, Star, Heart, MessageSquare, Play, Eye, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { gameService } from '../../services/gameService';
import { authService } from '../../services/authService';
import { formatDate, formatRelativeTime } from '../../utils/date';
import PlayableDemoModal from '../games/PlayableDemoModal';

export default function DeveloperHomeView({ user, onSwitchToStorefront }) {
  const [games, setGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoGame, setDemoGame] = useState(null);

  useEffect(() => {
    async function loadDevData() {
      setLoading(true);
      try {
        const [gamesRes, profileRes] = await Promise.all([
          gameService.getGames({ developerId: user.id, limit: 20 }),
          authService.getUserProfile(user.username)
        ]);
        setGames(gamesRes.games || []);
        setReviews(profileRes.reviews || []);
      } catch (err) {
        console.error('Failed to load developer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      loadDevData();
    }
  }, [user]);

  const totalReviewsCount = games.reduce((acc, g) => acc + (parseInt(g.review_count, 10) || 0), 0);
  const avgRating = games.length > 0
    ? (games.reduce((acc, g) => acc + (parseFloat(g.average_rating) || 0), 0) / games.length).toFixed(1)
    : '0.0';

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div
        className="card"
        style={{
          padding: '2rem',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-subtle)',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={user.name}
            style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '2px solid var(--accent-purple)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{user.name} Studio</h1>
              <span className="badge badge-purple">Verified Developer</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Developer Studio Portal • Manage titles, track community feedback, and test playable builds.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onSwitchToStorefront}
            className="btn btn-secondary btn-sm"
          >
            <Eye size={15} /> Preview Storefront
          </button>
          <Link to="/community" className="btn btn-outline btn-sm">
            <MessageSquare size={15} /> #dev-talk Chat
          </Link>
          <Link to="/developer" className="btn btn-fire btn-sm">
            <PlusCircle size={15} /> Publish Game
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Catalog Titles
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff' }}>
            {games.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Published on IndieGamer Hub
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Player Reviews
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff' }}>
            {totalReviewsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Across all studio releases
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Studio Rating
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Star size={22} color="#f59e0b" fill="#f59e0b" /> {avgRating}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Average gamer sentiment
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Network Status
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.65rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={18} /> Ready & Synced
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Steam API & Web Demo engine online
          </div>
        </div>
      </div>

      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>My Studio Games</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Manage your releases, update store details, and launch interactive browser demos.
            </p>
          </div>
          <Link to="/developer" className="btn btn-outline btn-sm">
            <span>Manage All Games</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading studio games...</div>
        ) : games.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Code size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Games Published Yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Submit your first indie title to start receiving community reviews and demo feedback.
            </p>
            <Link to="/developer" className="btn btn-fire btn-sm">
              <PlusCircle size={15} /> Publish First Game
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {games.map((g) => (
              <div key={g.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={g.cover_image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'}
                    alt={g.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.35rem' }}>
                    <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                      {g.status}
                    </span>
                    {g.is_featured && <span className="badge badge-cyan">Featured</span>}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>{g.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      <span>Released: {formatDate(g.release_date)}</span>
                      <span>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24' }}>
                        <Star size={13} fill="#fbbf24" /> {Number(g.average_rating).toFixed(1)} ({g.review_count})
                      </span>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {g.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      type="button"
                      onClick={() => setDemoGame(g)}
                      className="btn btn-fire btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                    >
                      <Play size={13} /> Test Demo
                    </button>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link
                        to={`/games/${g.slug}`}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                      >
                        <ExternalLink size={13} /> Store Page
                      </Link>
                      <Link
                        to="/developer"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {reviews.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Recent Player Feedback</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Latest reviews submitted by gamers on your games.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {reviews.slice(0, 4).map((r) => (
              <div key={r.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                    {r.game_title || 'Indie Game'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontSize: '0.85rem' }}>
                    <Star size={14} fill="#fbbf24" /> {r.rating}/5
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  "{r.content}"
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>by @{r.username}</span>
                  <span>{formatRelativeTime(r.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {demoGame && (
        <PlayableDemoModal
          gameTitle={demoGame.title}
          demoUrl={demoGame.playable_demo_url}
          onClose={() => setDemoGame(null)}
        />
      )}
    </div>
  );
}
