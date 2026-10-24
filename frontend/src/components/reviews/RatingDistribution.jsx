import React from 'react';
import { Star } from 'lucide-react';

export default function RatingDistribution({ distribution = {}, total = 0, averageRating = 0 }) {
  const avg = Number(averageRating) || 0;
  const stars = [5, 4, 3, 2, 1];

  return (
    <div
      className="card"
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '2rem'
      }}
    >
      <div style={{ textAlign: 'center', minWidth: '130px' }}>
        <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1, color: '#ffffff' }}>
          {avg > 0 ? avg.toFixed(1) : '—'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0.4rem 0' }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={16}
              fill={s <= Math.round(avg) ? '#fbbf24' : 'transparent'}
              stroke={s <= Math.round(avg) ? '#fbbf24' : '#64748b'}
            />
          ))}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {total} {total === 1 ? 'player review' : 'player reviews'}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {stars.map((star) => {
          const count = distribution[star] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.8rem' }}>
              <span style={{ width: '24px', display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--text-secondary)' }}>
                {star}★
              </span>
              <div
                style={{
                  flex: 1,
                  height: '8px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: star >= 4 ? 'var(--accent-purple)' : star === 3 ? 'var(--accent-cyan)' : 'var(--color-warning)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
              <span style={{ width: '38px', textAlign: 'right', color: 'var(--text-muted)' }}>
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
