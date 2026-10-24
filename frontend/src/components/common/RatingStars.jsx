import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, max = 5, size = 16, interactive = false, onRate = null, reviewCount = null }) {
  const currentRating = Number(rating) || 0;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[...Array(max)].map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.round(currentRating);
          return (
            <button
              type="button"
              key={i}
              disabled={!interactive}
              onClick={() => interactive && onRate && onRate(starValue)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: interactive ? 'pointer' : 'default',
                display: 'inline-flex',
                color: isFilled ? '#fbbf24' : '#334155',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => interactive && (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseLeave={(e) => interactive && (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Star
                size={size}
                fill={isFilled ? '#fbbf24' : 'transparent'}
                stroke={isFilled ? '#fbbf24' : '#64748b'}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
      {currentRating > 0 && !interactive && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginLeft: '0.2rem' }}>
          {currentRating.toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
