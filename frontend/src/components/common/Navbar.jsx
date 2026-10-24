import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Gamepad2, Search, Heart, Bell, Menu, X, User, LogOut, Shield, Code, ChevronDown, Check, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { formatRelativeTime } from '../../utils/date';

export default function Navbar({ onOpenCommandPalette }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  async function loadNotifications() {
    try {
      const data = await authService.getNotifications();
      setNotifications(data || []);
      const unread = (data || []).filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (e) {
    }
  }

  async function handleMarkRead(id) {
    try {
      await authService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
    }
  }

  async function handleMarkAllRead() {
    try {
      await authService.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(9, 10, 15, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'all 0.2s ease'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px var(--accent-purple-glow)'
            }}
          >
            <Gamepad2 size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              INDIEGAMER
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-purple)', marginLeft: '0.25rem' }}>
              HUB
            </span>
            {isAuthenticated && user?.role === 'developer' && (
              <span className="badge badge-purple desktop-only" style={{ fontSize: '0.65rem', marginLeft: '0.5rem', verticalAlign: 'middle' }}>
                DEV STUDIO
              </span>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <span className="badge badge-cyan desktop-only" style={{ fontSize: '0.65rem', marginLeft: '0.5rem', verticalAlign: 'middle' }}>
                ADMIN STAFF
              </span>
            )}
            {isAuthenticated && user?.role === 'gamer' && (
              <span className="badge desktop-only" style={{ fontSize: '0.65rem', marginLeft: '0.5rem', verticalAlign: 'middle', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                GAMER
              </span>
            )}
          </div>
        </Link>

        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {user?.role === 'developer' ? (
            <>
              <Link
                to="/"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Studio Home
              </Link>
              <Link
                to="/developer"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/developer') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/developer') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                My Games
              </Link>
              <Link
                to="/discover"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/discover') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/discover') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Storefront
              </Link>
              <Link
                to="/community"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/community') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/community') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Dev-Talk
              </Link>
            </>
          ) : user?.role === 'admin' ? (
            <>
              <Link
                to="/"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Operations Home
              </Link>
              <Link
                to="/admin"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/admin') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/admin') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Command Center
              </Link>
              <Link
                to="/developer"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/developer') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/developer') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Dev Portal
              </Link>
              <Link
                to="/discover"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/discover') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/discover') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Storefront
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Home
              </Link>
              <Link
                to="/discover"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/discover') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/discover') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Discover
              </Link>
              <Link
                to="/trending"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/trending') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/trending') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Trending
              </Link>
              <Link
                to="/upcoming"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/upcoming') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/upcoming') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Upcoming
              </Link>
              <Link
                to="/community"
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  color: isActive('/community') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive('/community') ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  padding: '0.35rem 0'
                }}
              >
                Community
              </Link>
            </>
          )}
        </nav>

        <div
          onClick={onOpenCommandPalette}
          className="desktop-only"
          style={{
            position: 'relative',
            width: '240px',
            cursor: 'pointer'
          }}
          title="Spotlight Search (Cmd+K or Ctrl+K)"
        >
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <div
            style={{
              width: '100%',
              padding: '0.45rem 0.85rem 0.45rem 2.25rem',
              fontSize: '0.85rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <span>Search catalog...</span>
            <kbd
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                fontWeight: 600
              }}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <>
              <Link to="/favorites" className="btn-icon" title="My Wishlist & Favorites">
                <Heart size={18} />
              </Link>

              <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  style={{ position: 'relative' }}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        backgroundColor: 'var(--color-danger)',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div
                    className="card animate-fade-in"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '120%',
                      width: '320px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      zIndex: 200,
                      boxShadow: 'var(--shadow-lg)',
                      borderColor: 'var(--border-medium)',
                      padding: '0.5rem 0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent-purple)', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (!n.is_read) handleMarkRead(n.id);
                            if (n.link) navigate(n.link);
                          }}
                          style={{
                            padding: '0.75rem 1rem',
                            borderBottom: '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            backgroundColor: n.is_read ? 'transparent' : 'rgba(139, 92, 246, 0.08)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatRelativeTime(n.created_at)}</span>
                          </div>
                          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {user?.role === 'developer' && (
                <Link to="/developer" className="btn btn-fire btn-sm desktop-only">
                  <PlusCircle size={15} />
                  <span>Submit Game</span>
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-primary btn-sm desktop-only" style={{ background: 'var(--accent-purple)' }}>
                  <Shield size={15} />
                  <span>Admin Panel</span>
                </Link>
              )}

              <div ref={userRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  <img
                    src={user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-purple)' }}
                  />
                  <ChevronDown size={14} color="var(--text-secondary)" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="card animate-fade-in"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '120%',
                      width: '210px',
                      zIndex: 200,
                      boxShadow: 'var(--shadow-lg)',
                      borderColor: 'var(--border-medium)',
                      padding: '0.5rem 0'
                    }}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{user?.username} · <span className="badge badge-purple" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>{user?.role}</span></div>
                    </div>

                    <Link
                      to={`/profile/${user?.username}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      <User size={16} /> Profile
                    </Link>

                    {(user?.role === 'developer' || user?.role === 'admin') && (
                      <Link
                        to="/developer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <Code size={16} /> Developer Portal
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <Shield size={16} /> Admin Console
                      </Link>
                    )}

                    <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0.25rem 0' }} />

                    <button
                      type="button"
                      onClick={logout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.85rem',
                        color: 'var(--color-danger)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join Hub
              </Link>
            </div>
          )}

          <button
            type="button"
            className="mobile-only btn-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="mobile-only animate-fade-in"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-medium)',
            padding: '1.25rem'
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1.25rem' }}>
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {user?.role === 'developer' ? (
              <>
                <Link to="/" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Studio Home</Link>
                <Link to="/developer" style={{ padding: '0.5rem 0', fontWeight: 500, color: 'var(--accent-purple)' }}>My Studio Games</Link>
                <Link to="/discover" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Storefront</Link>
                <Link to="/community" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Dev-Talk Chat</Link>
              </>
            ) : user?.role === 'admin' ? (
              <>
                <Link to="/" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Operations Home</Link>
                <Link to="/admin" style={{ padding: '0.5rem 0', fontWeight: 500, color: 'var(--accent-cyan)' }}>Admin Center</Link>
                <Link to="/developer" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Developer Portal</Link>
                <Link to="/discover" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Storefront</Link>
              </>
            ) : (
              <>
                <Link to="/" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Home</Link>
                <Link to="/discover" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Discover</Link>
                <Link to="/trending" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Trending</Link>
                <Link to="/upcoming" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Upcoming</Link>
                <Link to="/community" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Community</Link>
                {isAuthenticated && (
                  <Link to="/favorites" style={{ padding: '0.5rem 0', fontWeight: 500 }}>Favorites</Link>
                )}
              </>
            )}
            {isAuthenticated && (
              <button
                type="button"
                onClick={logout}
                className="btn btn-outline btn-sm"
                style={{ marginTop: '0.5rem', justifyContent: 'flex-start' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
