import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, Lock, ArrowLeft, Send, Trash2 } from 'lucide-react';
import PostCard from '../components/forum/PostCard';
import { forumService } from '../services/forumService';
import { formatDateTime, formatRelativeTime } from '../utils/date';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

export default function ThreadDetail() {
  const { threadId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showConfirm, showAlert } = useModal();

  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadThreadAndPosts();
  }, [threadId]);

  async function loadThreadAndPosts() {
    setLoading(true);
    try {
      const [threadData, postsData] = await Promise.all([
        forumService.getThread(threadId),
        forumService.getPosts(threadId, { limit: 50 })
      ]);
      setThread(threadData);
      setPosts(postsData.posts || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Discussion thread not found.');
    } finally {
      setLoading(false);
    }
  }

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setReplying(true);
    try {
      await forumService.createPost(threadId, replyContent.trim());
      setReplyContent('');
      const res = await forumService.getPosts(threadId, { limit: 50 });
      setPosts(res.posts || []);
    } catch (err) {
      showAlert({
        title: 'Reply Failed',
        message: err.message || 'Failed to post reply.',
        confirmVariant: 'danger'
      });
    } finally {
      setReplying(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = await showConfirm({
      title: 'Remove Reply',
      message: 'Are you sure you want to remove this reply from the discussion?',
      confirmText: 'Remove Reply',
      confirmVariant: 'danger'
    });
    if (confirmed) {
      try {
        await forumService.deletePost(postId);
        const res = await forumService.getPosts(threadId, { limit: 50 });
        setPosts(res.posts || []);
      } catch (err) {
        showAlert({
          title: 'Action Failed',
          message: err.message || 'Failed to delete post.',
          confirmVariant: 'danger'
        });
      }
    }
  };

  const handleToggleLock = async () => {
    try {
      await forumService.lockThread(threadId, !thread.is_locked);
      setThread(prev => ({ ...prev, is_locked: !prev.is_locked }));
    } catch (err) {
      showAlert({
        title: 'Action Failed',
        message: err.message || 'Failed to toggle thread lock state.',
        confirmVariant: 'danger'
      });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading discussion thread...
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Discussion Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>The requested forum thread does not exist.</p>
        <Link to="/community" className="btn btn-primary">Back to Community</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '860px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={`/games/${thread.game_slug}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to {thread.game_title}
        </Link>
      </div>

      <div
        className="card"
        style={{
          padding: '1.75rem',
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-medium)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {thread.is_locked && (
              <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                <Lock size={12} /> Locked
              </span>
            )}
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              {thread.game_title}
            </span>
          </div>

          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={handleToggleLock}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              <Lock size={13} /> {thread.is_locked ? 'Unlock Thread' : 'Lock Thread'}
            </button>
          )}
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
          {thread.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <img
            src={thread.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt={thread.author_name}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
              {thread.author_name}
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Created {formatDateTime(thread.created_at)}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '1rem', lineHeight: '1.7', color: '#f1f5f9', whiteSpace: 'pre-line' }}>
          {thread.content}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={18} color="var(--accent-purple)" />
          Replies ({posts.length})
        </h2>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        {posts.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No replies yet. Be the first to join the conversation!
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>

      {thread.is_locked ? (
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)' }}>
          <Lock size={20} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '0.5rem' }} />
          This discussion thread has been locked by staff. Further replies are disabled.
        </div>
      ) : isAuthenticated ? (
        <form onSubmit={handlePostReply} className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem' }}>Leave a Reply</h3>
          <textarea
            rows={4}
            required
            placeholder="Write your response, suggestions, or insights..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="form-textarea"
            style={{ marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={replying} className="btn btn-primary">
              <Send size={15} />
              {replying ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      ) : (
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Join the discussion by logging into your IndieGamer Hub account.
          </p>
          <Link to="/login" className="btn btn-primary btn-sm">Log In to Reply</Link>
        </div>
      )}
    </div>
  );
}
