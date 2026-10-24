import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Gamepad2, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [emailOrUsername, setEmailOrUsername] = useState('alex@gamer.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login({ emailOrUsername, password });
      if (from === '/') {
        if (loggedUser?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (loggedUser?.role === 'developer') {
          navigate('/developer', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '2rem',
        paddingBottom: '3rem'
      }}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-medium)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '3.2rem',
              height: '3.2rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-purple)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--accent-purple-glow)',
              marginBottom: '1rem'
            }}
          >
            <Gamepad2 size={26} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome Back</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Log in to your IndieGamer Hub account
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1.25rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email-username">
              Email or Username
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="email-username"
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="alex@gamer.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ margin: '1rem 0', padding: '0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div><strong>Development test credentials:</strong></div>
            <div>Admin: <code>admin@indiegamerhub.com</code> / <code>Password@123</code></div>
            <div>Developer: <code>teamcherry@indiegamerhub.com</code> / <code>Password@123</code></div>
            <div>Gamer: <code>alex@gamer.com</code> / <code>Password@123</code></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
