import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Calendar, MessageSquare, Star, Code, Heart } from 'lucide-react';
import { authService } from '../services/authService';
import { formatMonthYear, formatDate, formatRelativeTime } from '../utils/date';
import GameCard from '../components/games/GameCard';
import ReviewCard from '../components/reviews/ReviewCard';
import ThreadCard from '../components/forum/ThreadCard';

export default function Profile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [threads, setThreads] = useState([]);
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState('reviews');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError('');
      try {
        const data = await authService.getUserProfile(username);
        setProfile(data.user);
        setReviews(data.reviews || []);
        setThreads(data.threads || []);
        setGames(data.games || []);
        if (data.user.role === 'developer') {
          setActiveTab('games');
        }
      } catch (err) {
        setError(err.message || 'User profile not found.');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading user profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Profile Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>The requested gamer profile could not be located.</p>
        <Link to="/" className="btn btn-primary">Return Home</Link>
      </div>
    );
  }

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
          gap: '2rem'
        }}
      >
        <img
          src={profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
          alt={profile.name}
          style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-purple)' }}
        />

        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{profile.name}</h1>
            <span
              className={`badge ${profile.role === 'admin' ? 'badge-cyan' : profile.role === 'developer' ? 'badge-purple' : ''}`}
              style={{ textTransform: 'capitalize' }}
            >
              {profile.role === 'admin' ? 'Staff Administrator' : profile.role === 'developer' ? 'Indie Developer Studio' : 'Community Gamer'}
            </span>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            @{profile.username}
          </div>

          {profile.bio && (
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '1rem', lineHeight: '1.5' }}>
              {profile.bio}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} color="var(--accent-purple)" />
              Joined {formatMonthYear(profile.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        {profile.role === 'developer' && (
          <button
            type="button"
            onClick={() => setActiveTab('games')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'games' ? '2px solid var(--accent-purple)' : '2px solid transparent',
              color: activeTab === 'games' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Code size={16} /> Created Games ({games.length})
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'reviews' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            color: activeTab === 'reviews' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Star size={16} /> Player Reviews ({reviews.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('threads')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'threads' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            color: activeTab === 'threads' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <MessageSquare size={16} /> Discussions ({threads.length})
        </button>
      </div>

      {activeTab === 'games' && profile.role === 'developer' && (
        <div>
          {games.length === 0 ? (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No games published yet.
            </div>
          ) : (
            <div className="grid-games">
              {games.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div>
          {reviews.length === 0 ? (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No reviews written yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'threads' && (
        <div>
          {threads.length === 0 ? (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No forum threads started yet.
            </div>
          ) : (
            <div>
              {threads.map((t) => (
                <ThreadCard key={t.id} thread={t} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
