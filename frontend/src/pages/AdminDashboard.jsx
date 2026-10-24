import React, { useState, useEffect } from 'react';
import { Shield, Users, Gamepad2, Star, MessageSquare, Calendar, Filter, CheckCircle, Ban, Trash2, Lock, Unlock } from 'lucide-react';
import { adminService } from '../services/adminService';
import { gameService } from '../services/gameService';
import { formatDate, formatRelativeTime } from '../utils/date';
import { useModal } from '../context/ModalContext';

export default function AdminDashboard() {
  const { showConfirm, showAlert } = useModal();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [datePreset, setDatePreset] = useState('30days');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [datePreset, customFrom, customTo]);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'games') loadGames();
    if (activeTab === 'reviews') loadReviews();
    if (activeTab === 'threads') loadThreads();
  }, [activeTab]);

  async function loadStats() {
    setLoading(true);
    try {
      let startDate = null;
      let endDate = null;

      if (datePreset === 'today') {
        startDate = new Date().toISOString().split('T')[0];
      } else if (datePreset === '7days') {
        const d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        startDate = d.toISOString().split('T')[0];
      } else if (datePreset === '30days') {
        const d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        startDate = d.toISOString().split('T')[0];
      } else if (datePreset === 'custom' && customFrom && customTo) {
        startDate = customFrom;
        endDate = customTo;
      }

      const res = await adminService.getStats({ startDate, endDate });
      setStats(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    try {
      const res = await adminService.getUsers({ limit: 50 });
      setUsers(res.users || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadGames() {
    try {
      const res = await gameService.getGames({ limit: 50, status: '' });
      setGames(res.games || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadReviews() {
    try {
      const res = await adminService.getReviews({ limit: 50 });
      setReviews(res.reviews || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadThreads() {
    try {
      const res = await adminService.getThreads({ limit: 50 });
      setThreads(res.threads || []);
    } catch (err) {
      console.error(err);
    }
  }

  const handleToggleUserStatus = async (userId, currentActive) => {
    try {
      await adminService.toggleUserStatus(userId, !currentActive);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentActive } : u));
    } catch (err) {
      showAlert({
        title: 'Action Failed',
        message: err.message || 'Failed to update user status.',
        confirmVariant: 'danger'
      });
    }
  };

  const handleToggleFeatureGame = async (gameId, currentFeatured) => {
    try {
      await adminService.toggleFeatureGame(gameId, !currentFeatured);
      setGames(prev => prev.map(g => g.id === gameId ? { ...g, is_featured: !currentFeatured } : g));
    } catch (err) {
      showAlert({
        title: 'Action Failed',
        message: err.message || 'Failed to update game featured status.',
        confirmVariant: 'danger'
      });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmed = await showConfirm({
      title: 'Moderate Review',
      message: 'Are you sure you want to moderate and permanently remove this review?',
      confirmText: 'Remove Review',
      confirmVariant: 'danger'
    });
    if (confirmed) {
      try {
        await adminService.deleteReview(reviewId);
        setReviews(prev => prev.filter(r => r.id !== reviewId));
      } catch (err) {
        showAlert({
          title: 'Action Failed',
          message: err.message || 'Failed to delete review.',
          confirmVariant: 'danger'
        });
      }
    }
  };

  const handleDeleteThread = async (threadId) => {
    const confirmed = await showConfirm({
      title: 'Delete Discussion Thread',
      message: 'Are you sure you want to delete this discussion thread and all its replies? This action cannot be undone.',
      confirmText: 'Delete Thread',
      confirmVariant: 'danger'
    });
    if (confirmed) {
      try {
        await adminService.deleteThread(threadId);
        setThreads(prev => prev.filter(t => t.id !== threadId));
      } catch (err) {
        showAlert({
          title: 'Action Failed',
          message: err.message || 'Failed to delete thread.',
          confirmVariant: 'danger'
        });
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-tag" style={{ color: 'var(--accent-cyan)' }}>
          <Shield size={14} style={{ display: 'inline', verticalAlign: '-1px' }} /> Operations Console
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Admin Management
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Monitor platform metrics, manage user permissions, curate featured games, and moderate community content.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        {['overview', 'users', 'games', 'reviews', 'threads'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent-purple)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="card" style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Calendar size={18} color="var(--accent-purple)" />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Analytics Time Window:</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
              {['today', '7days', '30days', 'custom'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDatePreset(preset)}
                  className={`btn btn-sm ${datePreset === preset ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {preset === '7days' ? 'Last 7 Days' : preset === '30days' ? 'Last 30 Days' : preset}
                </button>
              ))}

              {datePreset === 'custom' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>to</span>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                  />
                </div>
              )}
            </div>
          </div>

          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Total Users</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.users?.total_users || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', marginTop: '0.25rem' }}>
                  {stats.users?.total_developers || 0} devs · {stats.users?.total_gamers || 0} gamers
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Registered This Week</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-success)' }}>
                  +{stats.users?.users_this_week || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {stats.users?.users_today || 0} new today
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Catalog Games</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {stats.games?.total_games || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {stats.games?.featured_games || 0} featured spots
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Total Reviews</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>
                  {stats.reviews?.total_reviews || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  +{stats.reviews?.reviews_this_week || 0} this week
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Forum Activity</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                  {stats.forum?.total_threads || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {stats.forum?.total_posts || 0} total replies
                </div>
              </div>
            </div>
          )}

          {stats?.top_games && (
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                Top Performing Games in Hub
              </h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Game Title</th>
                      <th>Rating</th>
                      <th>Reviews</th>
                      <th>Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.top_games.map((g) => (
                      <tr key={g.id}>
                        <td style={{ fontWeight: 600 }}>{g.title}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                            <span>{Number(g.average_rating).toFixed(1)}</span>
                          </div>
                        </td>
                        <td>{g.review_count}</td>
                        <td>
                          {g.is_featured ? (
                            <span className="badge badge-featured">Featured</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>Standard</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Registered Users ({users.length})
          </h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Last Login</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img
                          src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                          alt={u.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-cyan' : u.role === 'developer' ? 'badge-purple' : 'badge-secondary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.is_active ? 'badge-released' : 'badge-danger'}`} style={{ color: u.is_active ? '#6ee7b7' : '#f87171' }}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {u.last_login_at ? formatRelativeTime(u.last_login_at) : 'Never'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                          className={`btn btn-sm ${u.is_active ? 'btn-outline' : 'btn-primary'}`}
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                        >
                          {u.is_active ? <Ban size={13} /> : <CheckCircle size={13} />}
                          <span>{u.is_active ? 'Deactivate' : 'Activate'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'games' && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Catalog Management ({games.length})
          </h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Game Title</th>
                  <th>Developer</th>
                  <th>Status</th>
                  <th>Release Date</th>
                  <th>Date Added</th>
                  <th>Featured Spot</th>
                  <th style={{ textAlign: 'right' }}>Toggle Feature</th>
                </tr>
              </thead>
              <tbody>
                {games.map((g) => (
                  <tr key={g.id}>
                    <td style={{ fontWeight: 600 }}>{g.title}</td>
                    <td>{g.developer_name || 'Independent Creator'}</td>
                    <td>
                      <span className={`badge ${g.status === 'published' ? 'badge-released' : 'badge-purple'}`}>
                        {g.status}
                      </span>
                    </td>
                    <td>{formatDate(g.release_date)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{formatDate(g.created_at)}</td>
                    <td>
                      {g.is_featured ? (
                        <span className="badge badge-featured">Featured</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Standard</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatureGame(g.id, g.is_featured)}
                        className={`btn btn-sm ${g.is_featured ? 'btn-outline' : 'btn-primary'}`}
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                      >
                        {g.is_featured ? 'Unfeature' : 'Feature Game'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Review Moderation Queue
          </h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Review Text</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.game_title}</td>
                    <td>{r.user_name} (@{r.user_username})</td>
                    <td>
                      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                        <Star size={13} fill="#fbbf24" stroke="#fbbf24" /> {r.rating}★
                      </div>
                    </td>
                    <td style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.review_text}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{formatDate(r.created_at)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(r.id)}
                        className="btn-icon"
                        style={{ color: 'var(--color-danger)' }}
                        title="Delete Inappropriate Review"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'threads' && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Forum Threads Moderation
          </h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Game</th>
                  <th>Author</th>
                  <th>Replies</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {threads.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.title}</td>
                    <td>{t.game_title}</td>
                    <td>{t.author_name}</td>
                    <td>{t.reply_count}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{formatDate(t.created_at)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteThread(t.id)}
                        className="btn-icon"
                        style={{ color: 'var(--color-danger)' }}
                        title="Delete Thread"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
