import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MessageSquare, Compass, Eye, Shield, Code, ArrowLeft } from 'lucide-react';

export default function GamerWelcomeBar({ user, isStorefrontPreview, onReturnToRoleHome }) {
  if (!user) return null;

  if (isStorefrontPreview) {
    return (
      <div
        style={{
          backgroundColor: user.role === 'admin' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(139, 92, 246, 0.15)',
          borderBottom: '1px solid',
          borderColor: user.role === 'admin' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(139, 92, 246, 0.3)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.875rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Eye size={16} color={user.role === 'admin' ? 'var(--accent-cyan)' : 'var(--accent-purple)'} />
          <span>
            You are currently previewing the <strong>Gamer Public Storefront</strong>.
          </span>
        </div>
        <button
          type="button"
          onClick={onReturnToRoleHome}
          className="btn btn-primary btn-sm"
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
        >
          <ArrowLeft size={14} />
          {user.role === 'admin' ? 'Return to Admin Command Center' : 'Return to Developer Studio'}
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem 0'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt={user.name}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-purple)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Welcome back, {user.name}!</span>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>Gamer</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Explore indie gems, discover new releases, and play demos in your browser.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Link to="/favorites" className="btn btn-outline btn-sm">
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>My Wishlist</span>
          </Link>
          <Link to={`/profile/${user.username}`} className="btn btn-outline btn-sm">
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <span>My Reviews</span>
          </Link>
          <Link to="/community" className="btn btn-outline btn-sm">
            <MessageSquare size={14} />
            <span>Live Chat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
