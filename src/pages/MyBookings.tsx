import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../types';
import api from '../utils/api';
import { Calendar, MapPin, Users, DollarSign, Clock, Star, MessageSquare } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ReviewModal from '../components/booking/ReviewModal';
import './MyBookings.css';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.bookings);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      cancelled: 'badge-danger',
      completed: 'badge-secondary'
    };
    
    return (
      <span className={`badge ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'badge-warning',
      paid: 'badge-success',
      refunded: 'badge-secondary',
      failed: 'badge-danger'
    };
    
    return (
      <span className={`badge ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.put(`/bookings/${bookingId}`, { status: 'cancelled' });
        await fetchBookings(); // Refresh the bookings list
      } catch (error: any) {
        console.error('Error cancelling booking:', error);
        setError('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleOpenReviewModal = (booking: Booking) => {
    setSelectedBookingForReview(booking);
  };

  const handleCloseReviewModal = () => {
    setSelectedBookingForReview(null);
  };

  const handleReviewSuccess = () => {
    fetchBookings(); // Refresh bookings to show the new review
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="my-bookings-page">
      <div className="container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage your travel reservations</p>
        </div>

        {error ? (
          <div className="error-message">
            {error}
            <button onClick={fetchBookings} className="btn btn-primary mt-2">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="bookings-filters">
              <div className="filter-buttons">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`filter-btn ${filter === option.value ? 'active' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="no-bookings">
                <h3>No bookings found</h3>
                <p>
                  {filter === 'all' 
                    ? "You haven't made any bookings yet. Start exploring amazing places to stay!"
                    : `No ${filter} bookings found.`
                  }
                </p>
                <Link to="/" className="btn btn-primary">
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="bookings-list">
                {filteredBookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-image">
                      <img
                        src={booking.listing.images[0]?.url || '/placeholder-image.jpg'}
                        alt={booking.listing.title}
                      />
                    </div>
                    
                    <div className="booking-content">
                      <div className="booking-header">
                        <div className="booking-title-section">
                          <h3 className="booking-title">
                            <Link to={`/listing/${booking.listing._id}`}>
                              {booking.listing.title}
                            </Link>
                          </h3>
                          <div className="booking-location">
                            <MapPin size={14} />
                            <span>{booking.listing.location.city}, {booking.listing.location.state}</span>
                          </div>
                        </div>
                        <div className="booking-status">
                          {getStatusBadge(booking.status)}
                          {getPaymentStatusBadge(booking.paymentStatus)}
                        </div>
                      </div>

                      <div className="booking-details">
                        <div className="booking-dates">
                          <Calendar size={16} />
                          <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                          <span className="booking-nights">({booking.nights} night{booking.nights > 1 ? 's' : ''})</span>
                        </div>
                        
                        <div className="booking-guests">
                          <Users size={16} />
                          <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                        </div>

                        <div className="booking-price">
                          <DollarSign size={16} />
                          <span>{formatPrice(booking.totalPrice)}</span>
                        </div>

                        <div className="booking-created">
                          <Clock size={16} />
                          <span>Booked on {formatDate(booking.createdAt)}</span>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="booking-requests">
                          <MessageSquare size={16} />
                          <span>Special requests: {booking.specialRequests}</span>
                        </div>
                      )}

                      {booking.review && (
                        <div className="booking-review">
                          <div className="review-rating">
                            <Star size={16} fill="currentColor" />
                            <span>{booking.review.rating}/5</span>
                          </div>
                          {booking.review.comment && (
                            <p className="review-comment">"{booking.review.comment}"</p>
                          )}
                        </div>
                      )}

                      <div className="booking-actions">
                        <Link 
                          to={`/listing/${booking.listing._id}`}
                          className="btn btn-outline"
                        >
                          View Property
                        </Link>
                        
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="btn btn-danger"
                          >
                            Cancel Booking
                          </button>
                        )}
                        
                        {booking.status === 'completed' && !booking.review && (
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleOpenReviewModal(booking)}
                          >
                            Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          onClose={handleCloseReviewModal}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default MyBookings;
