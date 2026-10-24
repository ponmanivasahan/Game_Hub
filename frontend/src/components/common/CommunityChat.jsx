import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Hash, Users, Sparkles, MessageCircle } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { formatRelativeTime } from '../../utils/date';

export default function CommunityChat({ defaultChannel = 'general', height = '520px' }) {
  const { user, isAuthenticated } = useAuth();
  const { showAlert } = useModal();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(defaultChannel);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const channels = [
    { id: 'general', name: 'general', desc: 'Main gamer lounge' },
    { id: 'dev-talk', name: 'dev-talk', desc: 'Game development & Steam' },
    { id: 'looking-for-group', name: 'lfg', desc: 'Looking for co-op & teams' }
  ];

  useEffect(() => {
    let isMounted = true;
    async function fetchChat() {
      try {
        const data = await chatService.getMessages(channel, 50);
        if (isMounted) {
          setMessages(data || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load chat:', err);
      }
    }

    fetchChat();
    const interval = setInterval(fetchChat, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [channel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!isAuthenticated) {
      showAlert({
        title: 'Sign In Required',
        message: 'Please sign in or register an account to chat with the indie gaming community.',
        actionText: 'Go to Login',
        onAction: () => navigate('/login')
      });
      return;
    }

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const newMsg = await chatService.sendMessage(channel, textToSend);
      setMessages(prev => [...prev, newMsg]);
    } catch (err) {
      showAlert({
        title: 'Message Not Sent',
        message: err.message || 'Failed to send message.',
        confirmVariant: 'danger'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height,
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
            <Hash size={18} color="var(--accent-purple)" />
            <span>{channel}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="desktop-only">
            {channels.find(c => c.id === channel)?.desc}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {channels.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChannel(c.id)}
              style={{
                background: channel === c.id ? 'var(--accent-purple)' : 'var(--bg-secondary)',
                color: channel === c.id ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: channel === c.id ? 'transparent' : 'var(--border-subtle)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              #{c.name}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
            Connecting to #{channel} lounge...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
            <MessageCircle size={32} style={{ margin: '0 auto 0.5rem auto' }} />
            <p>Welcome to #{channel}! Say hello to fellow indie gamers.</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = user && user.id === m.user_id;

            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isMe ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                  borderLeft: isMe ? '2px solid var(--accent-purple)' : '2px solid transparent'
                }}
              >
                <img
                  src={m.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                  alt={m.user_name}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: isMe ? 'var(--accent-purple)' : 'var(--text-primary)' }}>
                      {m.user_name}
                    </span>

                    {m.user_role === 'developer' && (
                      <span className="badge badge-purple" style={{ fontSize: '0.625rem', padding: '0.1rem 0.35rem' }}>
                        Dev
                      </span>
                    )}
                    {m.user_role === 'admin' && (
                      <span className="badge badge-cyan" style={{ fontSize: '0.625rem', padding: '0.1rem 0.35rem' }}>
                        Staff
                      </span>
                    )}

                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {formatRelativeTime(m.created_at)}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5, wordBreak: 'break-word' }}>
                    {m.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: 'var(--bg-card)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '0.65rem'
        }}
      >
        <input
          type="text"
          placeholder={isAuthenticated ? `Message #${channel}...` : 'Log in to join the conversation'}
          disabled={!isAuthenticated || sending}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="form-input"
          style={{ flex: 1, fontSize: '0.875rem' }}
        />

        <button
          type="submit"
          disabled={!isAuthenticated || sending || !inputText.trim()}
          className="btn btn-primary btn-sm"
          style={{ padding: '0 1rem' }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
