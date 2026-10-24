import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Lock, Mail, User, Code, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'gamer'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const newUser = await register(formData);
      if (newUser?.role === 'developer') {
        navigate('/developer');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
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
        paddingTop: '2.5rem',
        paddingBottom: '3.5rem'
      }}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
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
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Join IndieGamer Hub</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Choose your account role and become part of the community
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1.25rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Account Purpose</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'gamer' })}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: formData.role === 'gamer' ? '2px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                  backgroundColor: formData.role === 'gamer' ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card)',
                  color: formData.role === 'gamer' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Gamepad2 size={20} color={formData.role === 'gamer' ? 'var(--accent-purple)' : 'var(--text-muted)'} />
                <span>Gamer</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>Browse, review & favorite</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'developer' })}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: formData.role === 'developer' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  backgroundColor: formData.role === 'developer' ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-card)',
                  color: formData.role === 'developer' ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Code size={20} color={formData.role === 'developer' ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                <span>Developer</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>Publish & manage games</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="full-name">Full Name or Studio Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="full-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="e.g. Robin Walker"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="form-input"
              placeholder="e.g. robin_games"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="reg-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password (minimum 6 characters)</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="reg-password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.8rem' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
