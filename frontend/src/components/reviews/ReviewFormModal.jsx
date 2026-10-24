import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import RatingStars from '../common/RatingStars';

export default function ReviewFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 5);
      setReviewText(initialData.review_text || '');
    } else {
      setRating(5);
      setReviewText('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError('Please provide some thoughts in your review.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ rating, reviewText: reviewText.trim() });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Your Review' : 'Write a Review'}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Your Rating
          </label>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RatingStars
              rating={rating}
              size={28}
              interactive={true}
              onRate={(val) => setRating(val)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="review-text">
            Review Commentary
          </label>
          <textarea
            id="review-text"
            rows={5}
            className="form-textarea"
            placeholder="What did you love about this indie game? How were the mechanics, soundtrack, and gameplay feel?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Submitting...' : initialData ? 'Save Changes' : 'Post Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
