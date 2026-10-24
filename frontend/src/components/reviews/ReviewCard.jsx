import React from 'react';
import { Star, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { useAuth } from '../../context/AuthContext';

export default function ReviewCard({ review, onEdit = null, onDelete = null }) {
  const { user } = useAuth();

  const isAuthor = user && user.id === review.user_id;
  const isAdmin = user && user.role === 'admin';
  const canModify = isAuthor || isAdmin;

  const isEdited = Boolean(
    review.updated_at &&
    review.created_at &&
    new Date(review.updated_at).getTime() - new Date(review.created_at).getTime() > 1000 * 60
  );

  const formattedDate = formatDate(review.created_at);

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
            src={review.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt={review.user_name}
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
              {review.user_name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              @{review.user_username}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={15}
                fill={s <= review.rating ? '#fbbf24' : 'transparent'}
                stroke={s <= review.rating ? '#fbbf24' : '#475569'}
              />
            ))}
          </div>

          {canModify && (
            <div style={{ display: 'flex', gap: '0.35rem', marginLeft: '0.5rem' }}>
              {isAuthor && onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(review)}
                  title="Edit review"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                >
                  <Edit3 size={15} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(review.id)}
                  title="Delete review"
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.2rem' }}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.925rem', lineHeight: '1.6', color: '#e2e8f0', whiteSpace: 'pre-line' }}>
        {review.review_text}
      </p>

      <div style={{ marginTop: '0.75rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
        {formattedDate} {isEdited && <span>· Edited</span>}
      </div>
    </div>
  );
}
