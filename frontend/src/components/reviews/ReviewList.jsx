import React, { useState, useEffect } from 'react';
import { PlusCircle, MessageSquare } from 'lucide-react';
import ReviewCard from './ReviewCard';
import RatingDistribution from './RatingDistribution';
import ReviewFormModal from './ReviewFormModal';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';

export default function ReviewList({ gameId, gameTitle, averageRating = 0, reviewCount = 0 }) {
  const { user, isAuthenticated } = useAuth();
  const { showConfirm, showAlert } = useModal();
  const [reviews, setReviews] = useState([]);
  const [distribution, setDistribution] = useState({});
  const [total, setTotal] = useState(reviewCount);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    loadReviews();
  }, [gameId]);

  async function loadReviews() {
    setLoading(true);
    try {
      const data = await reviewService.getGameReviews(gameId, { limit: 20 });
      setReviews(data.reviews || []);
      setDistribution(data.distribution || {});
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateOrUpdate = async (formData) => {
    if (editingReview) {
      await reviewService.updateReview(editingReview.id, formData);
    } else {
      await reviewService.createReview(gameId, formData);
    }
    await loadReviews();
  };

  const handleDelete = async (reviewId) => {
    const confirmed = await showConfirm({
      title: 'Delete Review',
      message: 'Are you sure you want to remove your review for this game?',
      confirmText: 'Delete Review',
      confirmVariant: 'danger'
    });
    if (confirmed) {
      try {
        await reviewService.deleteReview(reviewId);
        await loadReviews();
      } catch (err) {
        showAlert({
          title: 'Action Failed',
          message: err.message || 'Failed to delete review',
          confirmVariant: 'danger'
        });
      }
    }
  };

  const userHasReviewed = user && reviews.some(r => r.user_id === user.id);

  return (
    <section style={{ marginTop: '2.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Player Reviews</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real reviews submitted by the IndieGamer Hub community.
          </p>
        </div>

        {isAuthenticated ? (
          !userHasReviewed && (
            <button
              type="button"
              onClick={() => { setEditingReview(null); setModalOpen(true); }}
              className="btn btn-primary btn-sm"
            >
              <PlusCircle size={16} /> Write a Review
            </button>
          )
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Log in to write a review
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <RatingDistribution
          distribution={distribution}
          total={total}
          averageRating={averageRating}
        />
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <MessageSquare size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No reviews yet</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Be the first gamer to share your thoughts on {gameTitle}!
          </p>
        </div>
      ) : (
        <div>
          {reviews.map((rev) => (
            <ReviewCard
              key={rev.id}
              review={rev}
              onEdit={(r) => { setEditingReview(r); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ReviewFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingReview}
      />
    </section>
  );
}
