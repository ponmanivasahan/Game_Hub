import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, Lock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/date';

export default function ThreadCard({ thread, gameSlug }) {
  const targetSlug = gameSlug || thread.game_slug;

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)',
        marginBottom: '1rem',
        transition: 'transform 0.15s ease, border-color 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'var(--border-medium)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            {thread.is_locked && (
              <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                <Lock size={12} /> Locked
              </span>
            )}
            {thread.game_title && (
              <span className="badge badge-cyan" style={{ fontSize: '0.675rem' }}>
                {thread.game_title}
              </span>
            )}
          </div>

          <Link to={`/games/${targetSlug}/threads/${thread.id}`}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {thread.title}
            </h3>
          </Link>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.75rem' }}>
            {thread.content}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Posted by <strong>{thread.author_name}</strong>
            </span>
            <span>
              Created {formatRelativeTime(thread.created_at)}
            </span>
            {thread.last_activity_at && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} /> Last activity {formatRelativeTime(thread.last_activity_at)}
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem 0.85rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            minWidth: '55px'
          }}
        >
          <MessageSquare size={16} color="var(--accent-purple)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>
            {thread.reply_count || 0}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Replies
          </span>
        </div>
      </div>
    </div>
  );
}
