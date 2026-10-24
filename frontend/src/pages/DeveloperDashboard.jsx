import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2, ExternalLink, Code2, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameFormModal from '../components/developer/GameFormModal';
import { gameService } from '../services/gameService';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { formatDate } from '../utils/date';

export default function DeveloperDashboard() {
  const { user } = useAuth();
  const { showConfirm, showAlert } = useModal();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  const [availableGenres, setAvailableGenres] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);

  useEffect(() => {
    loadDevGames();
    loadMetadata();
  }, [user]);

  async function loadDevGames() {
    setLoading(true);
    try {
      const data = await gameService.getGames({
        developerId: user.id,
        status: '',
        limit: 50
      });
      setGames(data.games || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMetadata() {
    try {
      const meta = await gameService.getMetadata();
      setAvailableGenres(meta.genres || []);
      setAvailablePlatforms(meta.platforms || []);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSaveGame = async (gameData) => {
    if (editingGame) {
      await gameService.updateGame(editingGame.id, gameData);
    } else {
      await gameService.createGame(gameData);
    }
    await loadDevGames();
  };

  const handleDeleteGame = async (gameId) => {
    const confirmed = await showConfirm({
      title: 'Delete Indie Game',
      message: 'Are you sure you want to permanently delete this game? This will remove all associated store listings and player review associations.',
      confirmText: 'Delete Game',
      confirmVariant: 'danger'
    });
    if (confirmed) {
      try {
        await gameService.deleteGame(gameId);
        await loadDevGames();
      } catch (err) {
        showAlert({
          title: 'Action Failed',
          message: err.message || 'Failed to delete game.',
          confirmVariant: 'danger'
        });
      }
    }
  };

  const totalGames = games.length;
  const totalReviews = games.reduce((acc, g) => acc + (g.review_count || 0), 0);
  const avgRating = totalGames > 0
    ? (games.reduce((acc, g) => acc + Number(g.average_rating || 0), 0) / totalGames).toFixed(1)
    : '0.0';

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <div className="section-tag" style={{ color: 'var(--accent-purple)' }}>
            <Code2 size={14} style={{ display: 'inline', verticalAlign: '-1px' }} /> Developer Workspace
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Developer Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage your published games, track community reviews, and import metadata seamlessly via Steam.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setEditingGame(null); setModalOpen(true); }}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> Add New Game
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>My Games</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalGames}</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Reviews</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{totalReviews}</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Average Catalog Rating</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Star size={24} fill="#fbbf24" /> {avgRating}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Catalog Titles
        </h2>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading developer games...
          </div>
        ) : games.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            You haven't submitted any games yet. Click "Add New Game" to publish your first title!
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Status</th>
                  <th>Release Date</th>
                  <th>Date Added</th>
                  <th>Rating</th>
                  <th>Price</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={game.cover_image_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=100&q=80'}
                          alt={game.title}
                          style={{ width: '45px', height: '30px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                        />
                        <Link to={`/games/${game.slug}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {game.title}
                        </Link>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${game.status === 'published' ? 'badge-released' : 'badge-purple'}`}>
                        {game.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{formatDate(game.release_date)}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDate(game.created_at)}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                        <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
                        <span>{Number(game.average_rating) > 0 ? Number(game.average_rating).toFixed(1) : '—'}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({game.review_count})</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>
                        {Number(game.steam_price) > 0 ? `$${Number(game.steam_price).toFixed(2)}` : 'Free'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link to={`/games/${game.slug}`} className="btn-icon" title="View Public Page">
                          <Eye size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setEditingGame(game); setModalOpen(true); }}
                          className="btn-icon"
                          title="Edit Game"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGame(game.id)}
                          className="btn-icon"
                          style={{ color: 'var(--color-danger)' }}
                          title="Delete Game"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <GameFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveGame}
        initialGame={editingGame}
        availableGenres={availableGenres}
        availablePlatforms={availablePlatforms}
      />
    </div>
  );
}
