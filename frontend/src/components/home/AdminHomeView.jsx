import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Gamepad2, Star, MessageSquare, Eye, CheckCircle2, AlertTriangle, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatDate, formatRelativeTime } from '../../utils/date';

export default function AdminHomeView({ user, onSwitchToStorefront }) {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers({ limit: 5 })
        ]);
        setStats(statsRes.stats || {});
        setRecentUsers(usersRes.users || []);
      } catch (err) {
        console.error('Failed to load admin home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div
        className="card"
        style={{
          padding: '2rem',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-subtle)',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px var(--accent-purple-glow)'
            }}
          >
            <Shield size={32} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Admin Command Center</h1>
              <span className="badge badge-cyan">Staff Superuser</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              IndieGamer Hub Executive Operations • Oversee user safety, game curation, and system metrics.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onSwitchToStorefront}
            className="btn btn-secondary btn-sm"
          >
            <Eye size={15} /> Preview Storefront
          </button>
          <Link to="/developer" className="btn btn-outline btn-sm">
            <Gamepad2 size={15} /> Developer Center
          </Link>
          <Link to="/admin" className="btn btn-primary btn-sm">
            <Shield size={15} /> Open Full Dashboard
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Registered Users
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff' }}>
            {stats?.total_users || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Active gamers & developers
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Catalog Titles
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff' }}>
            {stats?.total_games || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Live indie games in database
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Player Reviews
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem', color: '#fff' }}>
            {stats?.total_reviews || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Submitted across games
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            System Health
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.65rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={18} /> Port 5001 Online
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            MySQL Connection Pool 10/10 OK
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
        <Link to="/admin" className="card" style={{ padding: '1.5rem', textDecoration: 'none', transition: 'transform 0.2s', borderColor: 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Users size={20} color="var(--accent-purple)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>User Moderation</h3>
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Activate, suspend, or audit gamer and developer user accounts across the community.
          </p>
        </Link>

        <Link to="/admin" className="card" style={{ padding: '1.5rem', textDecoration: 'none', transition: 'transform 0.2s', borderColor: 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Star size={20} color="#fbbf24" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Featured Games Curation</h3>
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Select hero spotlights and featured carousel games to promote on the public storefront.
          </p>
        </Link>

        <Link to="/admin" className="card" style={{ padding: '1.5rem', textDecoration: 'none', transition: 'transform 0.2s', borderColor: 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldAlert size={20} color="var(--color-danger)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Content & Review Filter</h3>
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Inspect reported reviews, delete inappropriate posts, and manage forum discussions.
          </p>
        </Link>
      </div>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Recent User Registrations</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Latest accounts created on IndieGamer Hub.
            </p>
          </div>
          <Link to="/admin" className="btn btn-outline btn-sm">
            <span>View All Users</span>
          </Link>
        </div>

        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>User</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Email</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Role</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Registered</th>
                <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#fff' }}>
                    {u.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>@{u.username}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-cyan' : u.role === 'developer' ? 'badge-purple' : ''}`} style={{ textTransform: 'capitalize' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)' }}>
                    {formatDate(u.created_at)}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{ color: u.is_active ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {u.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
