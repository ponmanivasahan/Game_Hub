import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Heart, Code2, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '3.5rem 0 2rem 0',
        marginTop: 'auto'
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Gamepad2 size={16} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>INDIEGAMER HUB</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              A dedicated sanctuary and community platform connecting passionate indie game creators with curious players worldwide.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Discovery
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/discover" style={{ color: 'var(--text-secondary)' }}>All Games</Link></li>
              <li><Link to="/trending" style={{ color: 'var(--text-secondary)' }}>Trending Releases</Link></li>
              <li><Link to="/upcoming" style={{ color: 'var(--text-secondary)' }}>Upcoming Anticipated</Link></li>
              <li><Link to="/discover?genre=metroidvania" style={{ color: 'var(--text-secondary)' }}>Metroidvanias</Link></li>
              <li><Link to="/discover?genre=roguelike" style={{ color: 'var(--text-secondary)' }}>Roguelikes</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Community & Hub
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/community" style={{ color: 'var(--text-secondary)' }}>Discussion Boards</Link></li>
              <li><Link to="/register" style={{ color: 'var(--text-secondary)' }}>Create Account</Link></li>
              <li><Link to="/developer" style={{ color: 'var(--text-secondary)' }}>Publish Your Game</Link></li>
              <li><Link to="/favorites" style={{ color: 'var(--text-secondary)' }}>Your Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Platform Info
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Integrated with Steam & RAWG data APIs for real-time indie telemetry.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', fontSize: '0.775rem', color: 'var(--accent-cyan)' }}>
              <Sparkles size={14} /> MySQL 8 + React Powered
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} IndieGamer Hub. Crafted with dedication for independent game creators and gamers.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>API Integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
