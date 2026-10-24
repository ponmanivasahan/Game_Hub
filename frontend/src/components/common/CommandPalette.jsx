import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Gamepad2, Tag, Compass, Heart, Shield, MessageSquare, Flame, Code, ArrowRight, X } from 'lucide-react';
import { gameService } from '../../services/gameService';
import { useAuth } from '../../context/AuthContext';

export default function CommandPalette({ isOpen, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ games: [], tags: [], genres: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const quickActions = [
    { id: 'trending', title: 'Trending Leaderboard', icon: Flame, path: '/trending', color: '#f97316' },
    { id: 'discover', title: 'Discover All Games', icon: Compass, path: '/discover', color: 'var(--accent-purple)' },
    { id: 'community', title: 'Community Live Chat', icon: MessageSquare, path: '/community', color: 'var(--accent-cyan)' },
    ...(isAuthenticated ? [{ id: 'favorites', title: 'My Wishlist & Favorites', icon: Heart, path: '/favorites', color: '#ef4444' }] : []),
    ...(isAuthenticated && (user?.role === 'developer' || user?.role === 'admin') ? [{ id: 'dev', title: 'Developer Studio', icon: Code, path: '/developer', color: 'var(--accent-purple)' }] : []),
    ...(isAuthenticated && user?.role === 'admin' ? [{ id: 'admin', title: 'Admin Command Center', icon: Shield, path: '/admin', color: 'var(--accent-cyan)' }] : [])
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ games: [], tags: [], genres: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await gameService.omniSearch(query, 6);
        setResults(data || { games: [], tags: [], genres: [] });
        setSelectedIndex(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const items = [];
  if (query.trim()) {
    results.games.forEach((g) => items.push({ type: 'game', data: g, key: `game-${g.id}` }));
    results.tags.forEach((t) => items.push({ type: 'tag', data: t, key: `tag-${t.id}` }));
    results.genres.forEach((ge) => items.push({ type: 'genre', data: ge, key: `genre-${ge.id}` }));
  } else {
    quickActions.forEach((a) => items.push({ type: 'action', data: a, key: `act-${a.id}` }));
  }

  const handleSelect = (item) => {
    if (!item) return;
    onClose();
    if (item.type === 'game') {
      navigate(`/games/${item.data.slug}`);
    } else if (item.type === 'tag') {
      navigate(`/discover?tag=${item.data.slug}`);
    } else if (item.type === 'genre') {
      navigate(`/discover?genre=${item.data.slug}`);
    } else if (item.type === 'action') {
      navigate(item.data.path);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(items.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % Math.max(items.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        handleSelect(items[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh'
      }}
      onClick={onClose}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '75vh',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-medium)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: 0
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card)'
          }}
        >
          <Search size={20} color="var(--accent-purple)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a game, genre, tag, or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: '#fff',
              fontFamily: 'inherit'
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
            >
              <X size={16} />
            </button>
          )}
          <span
            style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.45rem',
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--text-muted)'
            }}
          >
            ESC
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
          {loading && (
            <div style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Searching catalog...
            </div>
          )}

          {!query.trim() && (
            <div style={{ padding: '0.5rem 1.25rem 0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Quick Navigation
            </div>
          )}

          {items.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.key}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1.25rem',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                  borderLeft: isSelected ? '3px solid var(--accent-purple)' : '3px solid transparent'
                }}
              >
                {item.type === 'game' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={item.data.cover_image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&q=80'}
                      alt={item.data.title}
                      style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                        {item.data.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ★ {Number(item.data.average_rating || 0).toFixed(1)} · {Number(item.data.steam_price) > 0 ? `$${item.data.steam_price}` : 'Free'}
                      </div>
                    </div>
                  </div>
                )}

                {item.type === 'tag' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag size={16} color="var(--accent-purple)" />
                    <div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#fff' }}>Tag: #{item.data.name}</span>
                    </div>
                  </div>
                )}

                {item.type === 'genre' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Gamepad2 size={16} color="var(--accent-cyan)" />
                    <div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#fff' }}>Genre: {item.data.name}</span>
                    </div>
                  </div>
                )}

                {item.type === 'action' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <item.data.icon size={18} color={item.data.color} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                      {item.data.title}
                    </span>
                  </div>
                )}

                <ArrowRight size={14} color={isSelected ? 'var(--accent-purple)' : 'transparent'} />
              </div>
            );
          })}

          {query.trim() && items.length === 0 && !loading && (
            <div style={{ padding: '2rem 1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No matches found for "{query}".
            </div>
          )}
        </div>

        <div
          style={{
            padding: '0.65rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span><kbd style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>↑</kbd> <kbd style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>↓</kbd> navigate</span>
            <span><kbd style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>↵</kbd> select</span>
            <span><kbd style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>esc</kbd> close</span>
          </div>
          <span>IndieGamer Hub Spotlight</span>
        </div>
      </div>
    </div>
  );
}
