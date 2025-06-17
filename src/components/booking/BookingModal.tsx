import React, { useState } from 'react';
import { Listing } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { X, Calendar, Users } from 'lucide-react';
import PaymentForm from '../payment/PaymentForm';
import './BookingModal.css';

interface BookingModalProps {
  listing: Listing;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ listing, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'booking' | 'payment'>('booking');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
    guestDetails: {
      name: user?.name || '',
      email: user?.email || '',
      phone: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle phone number input - only allow digits, spaces, parentheses, dashes, and plus sign
    if (name === 'guestDetails.phone') {
      const cleanedValue = value.replace(/[^0-9\s()\-+]/g, '');
      setFormData(prev => ({
        ...prev,
        guestDetails: {
          ...prev.guestDetails,
          phone: cleanedValue
        }
      }));
      setError(null);
      return;
    }
    
    if (name.startsWith('guestDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        guestDetails: {
          ...prev.guestDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'guests' ? parseInt(value) || 1 : value
      }));
    }
    setError(null);
  };

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    return listing.price * nights;
  };

  const getNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights : 0;
  };

  const validateForm = () => {
    if (!formData.checkIn || !formData.checkOut) {
      setError('Please select check-in and check-out dates');
      return false;
    }

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      setError('Check-in date must be in the future');
      return false;
    }

    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return false;
    }

    const nights = getNights();
    if (nights < listing.rules.minStay) {
      setError(`Minimum stay is ${listing.rules.minStay} night${listing.rules.minStay > 1 ? 's' : ''}`);
      return false;
    }

    if (nights > listing.rules.maxStay) {
      setError(`Maximum stay is ${listing.rules.maxStay} nights`);
      return false;
    }

    if (formData.guests > listing.capacity.guests) {
      setError(`This property can accommodate maximum ${listing.capacity.guests} guest${listing.capacity.guests > 1 ? 's' : ''}`);
      return false;
    }

    if (!formData.guestDetails.name || !formData.guestDetails.email || !formData.guestDetails.phone) {
      setError('Please fill in all guest details');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const bookingData = {
        listing: listing._id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        specialRequests: formData.specialRequests,
        guestDetails: formData.guestDetails
      };

      const response = await api.post('/bookings', bookingData);
      setBookingId(response.data.booking._id);
      setCurrentStep('payment');
    } catch (error: any) {
      console.error('Booking error:', error);
      setError(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    try {
      // Update booking with payment information
      await api.patch(`/bookings/${bookingId}/payment`, {
        paymentId: paymentResult.id,
        paymentStatus: 'paid',
        paymentMethod: 'credit_card'
      });
      onSuccess();
    } catch (error: any) {
      console.error('Payment update error:', error);
      setError('Payment successful but failed to update booking. Please contact support.');
    }
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h2>{currentStep === 'booking' ? `Reserve ${listing.title}` : 'Complete Payment'}</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {currentStep === 'booking' ? (
          <form onSubmit={handleSubmit} className="booking-form">
            {/* ...existing booking form content... */}
            <div className="booking-dates">
              <div className="form-group">
                <label htmlFor="checkIn" className="form-label">
                  <Calendar size={16} />
                  Check-in
                </label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  min={minDate}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkOut" className="form-label">
                  <Calendar size={16} />
                  Check-out
                </label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  min={formData.checkIn || minDate}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="guests" className="form-label">
                <Users size={16} />
                Number of Guests
              </label>
              <input
                type="number"
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                min="1"
                max={listing.capacity.guests}
                className="form-input"
                required
              />
              <small className="form-help">Maximum {listing.capacity.guests} guests</small>
            </div>

            <div className="guest-details">
              <h3>Guest Details</h3>
              
              <div className="form-group">
                <label htmlFor="guestDetails.name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="guestDetails.name"
                  name="guestDetails.name"
                  value={formData.guestDetails.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="guestDetails.email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="guestDetails.email"
                  name="guestDetails.email"
                  value={formData.guestDetails.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="guestDetails.phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="guestDetails.phone"
                  name="guestDetails.phone"
                  value={formData.guestDetails.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+1 (555) 123-4567"
                  pattern="[0-9\s()\-+]*"
                  title="Please enter a valid phone number"
                  required
                />
                <small className="form-help">Enter your phone number with country code</small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests" className="form-label">
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Any special requests or messages for the host..."
                rows={3}
              />
            </div>

            {getNights() > 0 && (
              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-row">
                  <span>{formatPrice(listing.price)} × {getNights()} night{getNights() > 1 ? 's' : ''}</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || calculateTotal() === 0}
              className="btn btn-primary booking-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <div className="btn-spinner"></div>
                  Creating Booking...
                </>
              ) : (
                `Continue to Payment - ${formatPrice(calculateTotal())}`
              )}
            </button>

            <p className="booking-note">
              You'll be redirected to secure payment after booking confirmation.
            </p>
          </form>
        ) : (
          <PaymentForm
            amount={calculateTotal()}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={() => setCurrentStep('booking')}
            bookingDetails={{
              listingTitle: listing.title,
              checkIn: formData.checkIn,
              checkOut: formData.checkOut,
              guests: formData.guests,
              nights: getNights()
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BookingModal;
