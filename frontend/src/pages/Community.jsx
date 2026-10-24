import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Star, MessageCircle, Hash, Sparkles } from 'lucide-react';
import ThreadCard from '../components/forum/ThreadCard';
import ReviewCard from '../components/reviews/ReviewCard';
import CommunityChat from '../components/common/CommunityChat';
import { forumService } from '../services/forumService';
import { reviewService } from '../services/reviewService';

export default function Community() {
  const [activeTab, setActiveTab] = useState('chat');
  const [threads, setThreads] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunityData() {
      try {
        const [threadData, reviewsData] = await Promise.all([
          forumService.getRecentThreads(12),
          reviewService.getRecentReviews(8)
        ]);
        setThreads(threadData || []);
        setRecentReviews(reviewsData || []);
      } catch (err) {
        console.error('Failed to load community data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCommunityData();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="section-tag" style={{ color: 'var(--accent-purple)' }}>
          <Users size={14} style={{ display: 'inline', verticalAlign: '-1px' }} /> Gamer Collective
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Community Lounge & Discussions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
          Chat in real-time with fellow indie gamers and verified developers, share tactics, and browse recent player reviews.
        </p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'chat' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            color: activeTab === 'chat' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem'
          }}
        >
          <MessageCircle size={18} color={activeTab === 'chat' ? 'var(--accent-purple)' : 'currentColor'} />
          Live Community Chat
          <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Live</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('threads')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'threads' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            color: activeTab === 'threads' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem'
          }}
        >
          <MessageSquare size={18} color={activeTab === 'threads' ? 'var(--accent-purple)' : 'currentColor'} />
          Discussion Threads ({threads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'reviews' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            color: activeTab === 'reviews' ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem'
          }}
        >
          <Star size={18} color={activeTab === 'reviews' ? '#fbbf24' : 'currentColor'} />
          Recent Reviews ({recentReviews.length})
        </button>
      </div>

      {activeTab === 'chat' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '2rem' }}>
          <div>
            <CommunityChat defaultChannel="general" height="580px" />
          </div>

          <div>
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                <Sparkles size={16} color="var(--accent-cyan)" /> Live Lounges
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <li style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#fff' }}>#general</strong> — Talk about favorite indie mechanics, releases, and soundtracks.
                </li>
                <li style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#fff' }}>#dev-talk</strong> — Game dev discussion, Steam API integrations, and asset feedback.
                </li>
                <li style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: '#fff' }}>#lfg</strong> — Form multiplayer parties and share game speedrunning tips.
                </li>
              </ul>
            </div>

            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Active Developers In Hub</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=80&q=80" style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="Team Cherry" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Team Cherry</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hollow Knight & Silksong</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="Supergiant Games" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Supergiant Games</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hades & Hades II</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="Sabotage Studio" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Sabotage Studio</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sea of Stars</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'threads' && (
        <div style={{ maxWidth: '880px' }}>
          {loading ? (
            <div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: '110px', marginBottom: '1rem' }} />
              ))}
            </div>
          ) : threads.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No discussions active right now. Visit any game page to start a thread!
            </div>
          ) : (
            <div>
              {threads.map((t) => (
                <ThreadCard key={t.id} thread={t} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div style={{ maxWidth: '880px' }}>
          {loading ? (
            <div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: '140px', marginBottom: '1rem' }} />
              ))}
            </div>
          ) : recentReviews.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No reviews submitted recently.
            </div>
          ) : (
            <div>
              {recentReviews.map((r) => (
                <div key={r.id} style={{ marginBottom: '1.25rem' }}>
                  <ReviewCard review={r} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
