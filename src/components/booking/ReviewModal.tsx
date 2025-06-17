import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Booking } from '../../types';
import api from '../../utils/api';
import './ReviewModal.css';

interface ReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await api.post(`/bookings/${booking._id}/review`, {
        rating,
        comment: comment.trim()
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredStar: number) => {
    setHoveredRating(hoveredStar);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h2>Leave a Review</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="review-modal-content">
          <div className="property-info">
            <h3>{booking.listing.title}</h3>
            <p>{booking.listing.location.city}, {booking.listing.location.state}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rating-section">
              <label>How was your stay?</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                    onMouseLeave={handleRatingLeave}
                  >
                    <Star size={32} fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              {(hoveredRating || rating) > 0 && (
                <p className="rating-text">{getRatingText(hoveredRating || rating)}</p>
              )}
            </div>

            <div className="comment-section">
              <label htmlFor="comment">Tell us about your experience (optional)</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details about your stay, what you loved, or suggestions for improvement..."
                rows={5}
                maxLength={1000}
              />
              <small>{comment.length}/1000 characters</small>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="review-modal-actions">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
