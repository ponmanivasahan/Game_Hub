import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { gameService } from '../../services/gameService';
import { Download, Plus, Trash2, Sparkles } from 'lucide-react';

export default function GameFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialGame = null,
  availableGenres = [],
  availablePlatforms = []
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steam_app_id: '',
    steam_price: '19.99',
    currency: 'USD',
    release_date: '',
    cover_image_url: '',
    trailer_url: '',
    playable_demo_url: 'builtin://retro-runner',
    status: 'published',
    genre_ids: [],
    platform_ids: [],
    screenshots: ['', '']
  });

  const [steamLoading, setSteamLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (initialGame) {
      setFormData({
        title: initialGame.title || '',
        description: initialGame.description || '',
        steam_app_id: initialGame.steam_app_id || '',
        steam_price: initialGame.steam_price !== undefined ? String(initialGame.steam_price) : '19.99',
        currency: initialGame.currency || 'USD',
        release_date: initialGame.release_date ? initialGame.release_date.split('T')[0] : '',
        cover_image_url: initialGame.cover_image_url || '',
        trailer_url: initialGame.trailer_url || '',
        playable_demo_url: initialGame.playable_demo_url || 'builtin://retro-runner',
        status: initialGame.status || 'published',
        genre_ids: (initialGame.genres || []).map(g => g.id),
        platform_ids: (initialGame.platforms || []).map(p => p.id),
        screenshots: (initialGame.screenshots || []).map(s => typeof s === 'string' ? s : s.image_url)
      });
    } else {
      setFormData({
        title: '',
        description: '',
        steam_app_id: '',
        steam_price: '19.99',
        currency: 'USD',
        release_date: '',
        cover_image_url: '',
        trailer_url: '',
        playable_demo_url: 'builtin://retro-runner',
        status: 'published',
        genre_ids: [],
        platform_ids: [],
        screenshots: ['', '']
      });
    }
    setError('');
    setSuccessMsg('');
  }, [initialGame, isOpen]);

  const handleFetchSteam = async () => {
    if (!formData.steam_app_id.trim()) {
      setError('Please enter a Steam App ID (e.g. 367520 for Hollow Knight, 1145360 for Hades).');
      return;
    }

    setSteamLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const data = await gameService.fetchSteam(formData.steam_app_id.trim());
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        steam_price: data.steam_price !== undefined ? String(data.steam_price) : prev.steam_price,
        currency: data.currency || prev.currency,
        release_date: data.release_date || prev.release_date,
        cover_image_url: data.cover_image_url || prev.cover_image_url,
        trailer_url: data.trailer_url || prev.trailer_url,
        screenshots: data.screenshots && data.screenshots.length > 0 ? data.screenshots : prev.screenshots
      }));
      setSuccessMsg(`Successfully populated metadata for "${data.title}" from Steam!`);
    } catch (err) {
      setError(err.message || 'Failed to fetch Steam metadata. You can enter details manually.');
    } finally {
      setSteamLoading(false);
    }
  };

  const handleGenreToggle = (genreId) => {
    setFormData(prev => {
      const exists = prev.genre_ids.includes(genreId);
      return {
        ...prev,
        genre_ids: exists
          ? prev.genre_ids.filter(id => id !== genreId)
          : [...prev.genre_ids, genreId]
      };
    });
  };

  const handlePlatformToggle = (platformId) => {
    setFormData(prev => {
      const exists = prev.platform_ids.includes(platformId);
      return {
        ...prev,
        platform_ids: exists
          ? prev.platform_ids.filter(id => id !== platformId)
          : [...prev.platform_ids, platformId]
      };
    });
  };

  const handleScreenshotChange = (idx, value) => {
    setFormData(prev => {
      const next = [...prev.screenshots];
      next[idx] = value;
      return { ...prev, screenshots: next };
    });
  };

  const addScreenshotField = () => {
    setFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, ''] }));
  };

  const removeScreenshotField = (idx) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...formData,
        steam_price: parseFloat(formData.steam_price) || 0,
        screenshots: formData.screenshots.filter(s => s && s.trim())
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save game.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialGame ? `Edit: ${initialGame.title}` : 'Publish New Indie Game'}
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', color: '#6ee7b7', fontSize: '0.85rem' }}>
            {successMsg}
          </div>
        )}

        <div
          style={{
            padding: '1rem',
            marginBottom: '1.25rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--accent-purple-glow)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> Fast Track via Steam App ID
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Enter your Steam App ID to automatically populate screenshots, artwork, trailer, pricing, and release date.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g. 367520 (Hollow Knight) or 1145360 (Hades)"
              value={formData.steam_app_id}
              onChange={(e) => setFormData({ ...formData, steam_app_id: e.target.value })}
              className="form-input"
              style={{ fontSize: '0.85rem' }}
            />
            <button
              type="button"
              onClick={handleFetchSteam}
              disabled={steamLoading}
              className="btn btn-secondary btn-sm"
              style={{ flexShrink: 0 }}
            >
              <Download size={14} />
              {steamLoading ? 'Fetching...' : 'Fetch'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Game Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
            placeholder="e.g. Neon Drift"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description & Lore</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-textarea"
            placeholder="Describe the gameplay loop, narrative hooks, and art style..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Price (USD)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.steam_price}
              onChange={(e) => setFormData({ ...formData, steam_price: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Official Release Date</label>
            <input
              type="date"
              value={formData.release_date}
              onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Publication Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-select"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Cover Artwork URL</label>
          <input
            type="url"
            value={formData.cover_image_url}
            onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
            className="form-input"
            placeholder="https://... cover image"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Trailer Video URL (YouTube or MP4)</label>
          <input
            type="url"
            value={formData.trailer_url}
            onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
            className="form-input"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Playable Web Demo</label>
          <select
            value={formData.playable_demo_url}
            onChange={(e) => setFormData({ ...formData, playable_demo_url: e.target.value })}
            className="form-select"
          >
            <option value="builtin://retro-runner">Built-in Retro Platformer / Runner Engine</option>
            <option value="builtin://arcade-shooter">Built-in Arcade Space Shooter Engine</option>
            <option value="">No Web Demo</option>
          </select>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Allows gamers to instantly play an interactive trial of your game directly in the browser!
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Genres</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
            {availableGenres.map((g) => {
              const selected = formData.genre_ids.includes(g.id);
              return (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => handleGenreToggle(g.id)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selected ? 'var(--accent-purple)' : 'var(--border-subtle)',
                    backgroundColor: selected ? 'rgba(139, 92, 246, 0.25)' : 'var(--bg-secondary)',
                    color: selected ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Platforms Supported</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
            {availablePlatforms.map((p) => {
              const selected = formData.platform_ids.includes(p.id);
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handlePlatformToggle(p.id)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selected ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                    backgroundColor: selected ? 'rgba(6, 182, 212, 0.25)' : 'var(--bg-secondary)',
                    color: selected ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Screenshots</label>
            <button
              type="button"
              onClick={addScreenshotField}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <Plus size={14} /> Add Screenshot URL
            </button>
          </div>
          {formData.screenshots.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <input
                type="url"
                value={s}
                onChange={(e) => handleScreenshotChange(idx, e.target.value)}
                placeholder={`Screenshot #${idx + 1} Image URL`}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              />
              {formData.screenshots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeScreenshotField(idx)}
                  className="btn-icon"
                  style={{ color: 'var(--color-danger)', flexShrink: 0 }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Saving...' : initialGame ? 'Update Game' : 'Publish Game'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
