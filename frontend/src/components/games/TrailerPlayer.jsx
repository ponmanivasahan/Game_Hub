import React from 'react';
import { Film } from 'lucide-react';

export default function TrailerPlayer({ trailerUrl, coverUrl = '' }) {
  if (!trailerUrl) {
    return (
      <div
        className="card"
        style={{
          aspectRatio: '16/9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          gap: '0.5rem',
          backgroundImage: coverUrl ? `url(${coverUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(9, 10, 15, 0.85)' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Film size={36} color="var(--text-muted)" />
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>No video trailer currently available for this title.</p>
        </div>
      </div>
    );
  }

  let embedUrl = null;
  const ytMatch = trailerUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    embedUrl = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  }

  return (
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
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title="Game Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        <video
          src={trailerUrl}
          controls
          poster={coverUrl}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        >
          Your browser does not support HTML5 video streaming.
        </video>
      )}
    </div>
  );
}
