import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Calendar, ExternalLink, MessageSquare, Plus, ShoppingBag, ShieldCheck, Gamepad2, Sparkles, Activity } from 'lucide-react';
import GameGallery from '../components/games/GameGallery';
import TrailerPlayer from '../components/games/TrailerPlayer';
import ReviewList from '../components/reviews/ReviewList';
import ThreadCard from '../components/forum/ThreadCard';
import GameCard from '../components/games/GameCard';
import PlayableDemoModal from '../components/games/PlayableDemoModal';
import Modal from '../components/common/Modal';
import { gameService } from '../services/gameService';
import { forumService } from '../services/forumService';
import { favoriteService } from '../services/favoriteService';
import { getReleaseInfo } from '../utils/date';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

export default function GameDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showAlert } = useModal();

  const [game, setGame] = useState(null);
  const [threads, setThreads] = useState([]);
  const [similarGames, setSimilarGames] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const [threadModalOpen, setThreadModalOpen] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [threadSubmitting, setThreadSubmitting] = useState(false);
  const [threadError, setThreadError] = useState('');

  useEffect(() => {
    async function loadGame() {
      setLoading(true);
      setError(null);
      try {
        const [data, simRes, telRes] = await Promise.all([
          gameService.getGameBySlug(slug),
          gameService.getSimilar(slug, 4).catch(() => []),
          gameService.getTelemetry(slug).catch(() => null)
        ]);

        setGame(data);
        setSimilarGames(simRes || []);
        setTelemetry(telRes);
        setIsFav(data.is_favorite || false);

        const threadData = await forumService.getThreads(data.id, { limit: 5 });
        setThreads(threadData.threads || []);
      } catch (err) {
        setError(err.message || 'Game not found');
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [slug]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      showAlert({
        title: 'Sign In Required',
        message: 'Please sign in or create an account to save games to your wishlist.',
        actionText: 'Go to Login',
        onAction: () => navigate('/login')
      });
      return;
    }
    try {
      const res = await favoriteService.toggleFavorite(game.id);
      setIsFav(res.isFavorite);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!threadTitle.trim() || !threadContent.trim()) {
      setThreadError('Title and message are required.');
      return;
    }
    setThreadSubmitting(true);
    setThreadError('');
    try {
      await forumService.createThread(game.id, {
        title: threadTitle.trim(),
        content: threadContent.trim()
      });
      setThreadModalOpen(false);
      setThreadTitle('');
      setThreadContent('');
      const refreshed = await forumService.getThreads(game.id, { limit: 5 });
      setThreads(refreshed.threads || []);
    } catch (err) {
      setThreadError(err.message || 'Failed to create discussion thread.');
    } finally {
      setThreadSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading game details...
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Game Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>The requested game could not be retrieved from the catalog.</p>
        <Link to="/discover" className="btn btn-primary">Browse All Games</Link>
      </div>
    );
  }

  const release = getReleaseInfo(game.release_date);

  return (
    <div>
      <section
        style={{
          position: 'relative',
          padding: '4rem 0 3rem 0',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-secondary)',
          overflow: 'hidden'
        }}
      >
        {game.cover_image_url && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${game.cover_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(30px) brightness(0.18)',
              transform: 'scale(1.1)'
            }}
          />
        )}

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-start' }}>
            <div
              className="card"
              style={{
                width: '260px',
                aspectRatio: '3/4',
                flexShrink: 0,
                boxShadow: 'var(--shadow-lg)',
                borderColor: 'var(--border-medium)',
                overflow: 'hidden'
              }}
            >
              <img
                src={game.cover_image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'}
                alt={game.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <span className={`badge ${release.isUpcoming ? 'badge-upcoming' : 'badge-released'}`}>
                  <Calendar size={13} /> {release.label}
                </span>
                {game.is_featured && <span className="badge badge-featured">Featured Spotlight</span>}
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.15 }}>
                {game.title}
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                <div>
                  Developer: <strong style={{ color: '#ffffff' }}>{game.developer_name || 'Independent Creator'}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                  <strong style={{ color: '#ffffff' }}>
                    {Number(game.average_rating) > 0 ? Number(game.average_rating).toFixed(1) : 'New'}
                  </strong>
                  <span>({game.review_count} reviews)</span>
                </div>
              </div>

              {telemetry && typeof telemetry.current_players === 'number' && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.4rem 0.85rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    color: '#6ee7b7',
                    marginBottom: '1.25rem'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-success)',
                      boxShadow: '0 0 8px var(--color-success)',
                      display: 'inline-block'
                    }}
                  />
                  <span><strong>{(telemetry.current_players ?? 0).toLocaleString()}</strong> playing now</span>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span>24h Peak: <strong>{(telemetry.peak_24h ?? 0).toLocaleString()}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span>{telemetry.positive_sentiment_percent ?? 95}% Positive</span>
                </div>
              )}

              {game.genres && game.genres.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {game.genres.map((g) => (
                    <span key={g.id || g.slug} className="badge badge-purple">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {Number(game.steam_price) > 0 ? `$${Number(game.steam_price).toFixed(2)}` : 'Free to Play'}
                </div>

                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="btn btn-fire"
                >
                  <Gamepad2 size={18} />
                  <span>Play Web Demo</span>
                </button>

                <button
                  type="button"
                  onClick={handleFavoriteToggle}
                  className={`btn ${isFav ? 'btn-danger' : 'btn-outline'}`}
                >
                  <Heart size={18} fill={isFav ? '#fff' : 'transparent'} />
                  <span>{isFav ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>

                {game.store_links && game.store_links.length > 0 ? (
                  game.store_links.map((s) => (
                    <a
                      key={s.id || s.store_name}
                      href={s.store_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      <ShoppingBag size={18} />
                      <span style={{ textTransform: 'capitalize' }}>Buy on {s.store_name}</span>
                      <ExternalLink size={14} />
                    </a>
                  ))
                ) : (
                  game.steam_app_id && (
                    <a
                      href={`https://store.steampowered.com/app/${game.steam_app_id}/`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      <ShoppingBag size={18} />
                      <span>View on Steam</span>
                      <ExternalLink size={14} />
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '3rem' }}>
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Media & Screenshots</h2>
              <GameGallery
                screenshots={game.screenshots || []}
                fallbackCover={game.cover_image_url}
              />
            </div>

            {game.trailer_url && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Official Trailer</h2>
                <TrailerPlayer trailerUrl={game.trailer_url} coverUrl={game.cover_image_url} />
              </div>
            )}

            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>About This Game</h2>
              <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', lineHeight: '1.7', fontSize: '0.975rem', color: '#e2e8f0', whiteSpace: 'pre-line' }}>
                {game.description}
              </div>
            </div>

            <ReviewList
              gameId={game.id}
              gameTitle={game.title}
              averageRating={game.average_rating}
              reviewCount={game.review_count}
            />
          </div>

          <div>
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                Game Specifications
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Release Date</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{release.formatted}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Developer</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{game.developer_name || 'Indie Studio'}</span>
                </div>

                {game.steam_app_id && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Steam App ID</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{game.steam_app_id}</span>
                  </div>
                )}

                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Platforms</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {game.platforms && game.platforms.length > 0 ? (
                      game.platforms.map((p) => (
                        <span key={p.id || p.slug} className="badge badge-cyan" style={{ fontSize: '0.675rem' }}>
                          {p.name}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>PC / Consoles</span>
                    )}
                  </div>
                </div>

                {game.tags && game.tags.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Tags</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {game.tags.map((t) => (
                        <span key={t.id || t.slug} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Discussions</h3>
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => setThreadModalOpen(true)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    <Plus size={13} /> New Thread
                  </button>
                )}
              </div>

              {threads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No discussion threads yet for this game.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {threads.map((t) => (
                    <ThreadCard key={t.id} thread={t} gameSlug={game.slug} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {similarGames.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div className="section-tag" style={{ color: 'var(--accent-cyan)' }}>
                  <Sparkles size={13} style={{ display: 'inline', verticalAlign: '-1px' }} /> Vector Match Engine
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>AI Recommended Similar Titles</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Algorithmically matched based on gameplay mechanics, tag similarity, and player ratings.
                </p>
              </div>
            </div>

            <div className="grid-games">
              {similarGames.map((simGame) => (
                <div key={simGame.id} style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      zIndex: 10,
                      backgroundColor: 'rgba(9, 10, 15, 0.9)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid var(--accent-purple)',
                      color: '#c084fc',
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Sparkles size={11} color="var(--accent-purple)" />
                    <span>{simGame.similarity_score}% Match</span>
                  </div>
                  <GameCard game={simGame} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <PlayableDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        gameTitle={game.title}
        demoUrl={game.playable_demo_url}
      />

      <Modal
        isOpen={threadModalOpen}
        onClose={() => setThreadModalOpen(false)}
        title={`Start Discussion for ${game.title}`}
      >
        <form onSubmit={handleCreateThread}>
          {threadError && (
            <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.85rem' }}>
              {threadError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Discussion Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Boss strategy, build recommendation..."
              value={threadTitle}
              onChange={(e) => setThreadTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message Content</label>
            <textarea
              rows={5}
              required
              placeholder="Share your question or discussion topic with fellow indie gamers..."
              value={threadContent}
              onChange={(e) => setThreadContent(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setThreadModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={threadSubmitting} className="btn btn-primary">
              {threadSubmitting ? 'Posting...' : 'Start Discussion'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
