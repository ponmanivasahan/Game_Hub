import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--accent-purple)', fontWeight: 500 }}>Loading IndieGamer Hub...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem', textAlign: 'center', borderColor: 'var(--border-medium)' }}>
          <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <ShieldAlert size={32} color="var(--color-danger)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Restricted Access</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            This portal is exclusively accessible to <strong>{allowedRoles.join(' or ')}</strong> accounts.
            You are currently signed in as a <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{user.role}</span>.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem' }}>
            <Link to="/" className="btn btn-primary btn-sm">
              <ArrowLeft size={16} /> Return to Storefront
            </Link>
            {user.role === 'developer' && (
              <Link to="/developer" className="btn btn-secondary btn-sm">
                Go to Developer Center
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return children;
}
