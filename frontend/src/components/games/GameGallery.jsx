import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export default function GameGallery({ screenshots = [], fallbackCover = '' }) {
  const images = screenshots.length > 0
    ? screenshots.map(s => typeof s === 'string' ? s : s.image_url)
    : [fallbackCover || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div
        className="card"
        style={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '16/9',
          backgroundColor: '#000000',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <img
          src={images[activeIndex]}
          alt={`Screenshot ${activeIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.25s ease'
          }}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous screenshot"
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(9, 10, 15, 0.75)',
                border: '1px solid var(--border-medium)',
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)'
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next screenshot"
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(9, 10, 15, 0.75)',
                border: '1px solid var(--border-medium)',
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)'
              }}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          title="Fullscreen view"
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            background: 'rgba(9, 10, 15, 0.75)',
            border: '1px solid var(--border-medium)',
            color: '#fff',
            padding: '0.45rem',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              style={{
                width: '100px',
                aspectRatio: '16/9',
                padding: 0,
                border: idx === activeIndex ? '2px solid var(--accent-purple)' : '2px solid transparent',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: idx === activeIndex ? 1 : 0.6,
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(5, 7, 12, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={28} />
          </button>
          <img
            src={images[activeIndex]}
            alt="Fullscreen view"
            style={{ maxWidth: '95vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
