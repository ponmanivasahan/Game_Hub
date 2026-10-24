import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Calendar, Tag } from 'lucide-react';
import { getReleaseInfo } from '../../utils/date';
import { favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';

export default function GameCard({ game, onFavoriteToggle = null }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showAlert } = useModal();
  const [isFav, setIsFav] = useState(game.is_favorite || false);
  const [isHovered, setIsHovered] = useState(false);

  const release = getReleaseInfo(game.release_date);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showAlert({
        title: 'Sign In Required',
        message: 'Please sign in to add games to your favorites and wishlist.',
        actionText: 'Go to Login',
        onAction: () => navigate('/login')
      });
      return;
    }
    try {
      const res = await favoriteService.toggleFavorite(game.id);
      setIsFav(res.isFavorite);
      if (onFavoriteToggle) onFavoriteToggle(game.id, res.isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const coverImage = game.cover_image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';

  return (
    <article
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isHovered ? '0 12px 30px rgba(0,0,0,0.6)' : 'var(--shadow-md)',
        borderColor: isHovered ? 'var(--border-medium)' : 'var(--border-subtle)'
      }}
    >
      <Link to={`/games/${game.slug}`} style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9', display: 'block' }}>
        <img
          src={coverImage}
          alt={game.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)'
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(18, 20, 28, 0.9) 0%, transparent 60%)'
          }}
        />

        {game.is_featured ? (
          <span
            className="badge badge-featured"
            style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}
          >
            Featured
          </span>
        ) : null}

        <span
          className={`badge ${release.isUpcoming ? 'badge-upcoming' : 'badge-released'}`}
          style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}
        >
          {release.badgeText}
        </span>

        <button
          type="button"
          onClick={handleFavoriteClick}
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.75rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(18, 20, 28, 0.85)',
            backdropFilter: 'blur(4px)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFav ? 'var(--color-danger)' : '#cbd5e1',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={16} fill={isFav ? 'var(--color-danger)' : 'transparent'} />
        </button>
      </Link>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link to={`/games/${game.slug}`}>
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: isHovered ? 'var(--accent-purple)' : 'var(--text-primary)',
              transition: 'color 0.2s',
              marginBottom: '0.35rem'
            }}
          >
            {game.title}
          </h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          <span>By {game.developer_name || 'Independent Creator'}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: release.isUpcoming ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
            <Calendar size={13} />
            {release.formatted}
          </span>
        </div>

        {game.genres && game.genres.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {game.genres.slice(0, 3).map((g) => (
              <span
                key={g.id || g.slug}
                className="badge badge-purple"
                style={{ fontSize: '0.675rem', padding: '0.15rem 0.5rem' }}
              >
                {g.name}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Star size={15} fill="#fbbf24" stroke="#fbbf24" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {Number(game.average_rating) > 0 ? Number(game.average_rating).toFixed(1) : 'New'}
            </span>
            {game.review_count > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ({game.review_count})
              </span>
            )}
          </div>

          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {Number(game.steam_price) > 0
              ? `$${Number(game.steam_price).toFixed(2)}`
              : (game.steam_price === 0 || game.steam_price === '0.00' ? 'Free to Play' : '$19.99')}
          </div>
        </div>
      </div>
    </article>
  );
}
