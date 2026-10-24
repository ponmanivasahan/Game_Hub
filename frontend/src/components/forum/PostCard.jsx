import React from 'react';
import { formatDateTime } from '../../utils/date';
import { Trash2, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PostCard({ post, onEdit = null, onDelete = null }) {
  const { user } = useAuth();

  const isAuthor = user && user.id === post.user_id;
  const isAdmin = user && user.role === 'admin';
  const canModify = isAuthor || isAdmin;

  const isEdited = Boolean(
    post.updated_at &&
    post.created_at &&
    new Date(post.updated_at).getTime() - new Date(post.created_at).getTime() > 1000 * 60
  );

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)',
        marginBottom: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt={post.author_name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {post.author_name}
              </span>
              {post.author_role === 'developer' && (
                <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  Developer
                </span>
              )}
              {post.author_role === 'admin' && (
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                  Staff
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {formatDateTime(post.created_at)} {isEdited && <span>· Edited</span>}
            </div>
          </div>
        </div>

        {canModify && (
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {isAuthor && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(post)}
                title="Edit post"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
              >
                <Edit3 size={15} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(post.id)}
                title="Delete post"
                style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.2rem' }}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.925rem', lineHeight: '1.6', color: '#e2e8f0', whiteSpace: 'pre-line' }}>
        {post.content}
      </div>
    </div>
  );
}
