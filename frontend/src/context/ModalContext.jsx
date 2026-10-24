import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle2, ShieldAlert, X } from 'lucide-react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
    onConfirm: null,
    onCancel: null
  });

  const showConfirm = ({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'danger'
  }) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        confirmText,
        cancelText,
        confirmVariant,
        onConfirm: () => {
          setModalState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  const showAlert = ({
    title = 'Notice',
    message = '',
    confirmText = 'OK',
    confirmVariant = 'primary',
    actionText = null,
    onAction = null
  }) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'alert',
        title,
        message,
        confirmText: actionText || confirmText,
        cancelText: actionText ? 'Dismiss' : null,
        confirmVariant,
        onConfirm: () => {
          setModalState((prev) => ({ ...prev, isOpen: false }));
          if (onAction) onAction();
          resolve(true);
        },
        onCancel: () => {
          setModalState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  return (
    <ModalContext.Provider value={{ showConfirm, showAlert }}>
      {children}
      {modalState.isOpen && (
        <ConfirmDialog
          modalState={modalState}
          onClose={() => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
            if (modalState.onCancel) modalState.onCancel();
          }}
        />
      )}
    </ModalContext.Provider>
  );
}

function ConfirmDialog({ modalState, onClose }) {
  const { title, message, confirmText, cancelText, confirmVariant, onConfirm, onCancel } = modalState;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onCancel) onCancel();
        else onClose();
      } else if (e.key === 'Enter') {
        if (onConfirm) onConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onConfirm, onCancel, onClose]);

  const isDanger = confirmVariant === 'danger';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={() => {
        if (onCancel) onCancel();
        else onClose();
      }}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-medium)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isDanger ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {isDanger ? (
              <AlertTriangle size={22} color="var(--color-danger)" />
            ) : (
              <ShieldAlert size={22} color="var(--accent-purple)" />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onCancel) onCancel();
              else onClose();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.2rem'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          {cancelText && (
            <button
              type="button"
              onClick={onCancel || onClose}
              className="btn btn-secondary btn-sm"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`btn btn-sm ${isDanger ? 'btn-danger' : confirmVariant === 'fire' ? 'btn-fire' : 'btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
