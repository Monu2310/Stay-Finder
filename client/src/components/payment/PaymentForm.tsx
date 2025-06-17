import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, Check, AlertCircle } from 'lucide-react';
import './PaymentForm.css';

// Demo Stripe publishable key - replace with your actual key
const stripePromise = loadStripe('pk_test_demo_key_replace_with_actual');

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  bookingDetails: {
    listingTitle: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
  };
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  onCancel,
  bookingDetails
}) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        onCancel={onCancel}
        bookingDetails={bookingDetails}
      />
    </Elements>
  );
};

const PaymentFormContent: React.FC<PaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  onCancel,
  bookingDetails
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'demo'>('demo');
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setBillingDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDemoPayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      onSuccess({
        id: 'demo_payment_' + Date.now(),
        status: 'succeeded',
        amount: amount * 100, // Stripe amounts are in cents
        currency: 'usd',
        payment_method: 'demo_card_payment'
      });
    } catch (error) {
      onError('Demo payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      onError('Payment system not loaded');
      return;
    }

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // In a real implementation, you would:
      // 1. Create payment intent on your server
      // 2. Confirm payment with Stripe
      // For demo purposes, we'll simulate this
      
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Simulate successful payment
      onSuccess({
        id: paymentMethod.id,
        status: 'succeeded',
        amount: amount * 100,
        currency: 'usd',
        payment_method: paymentMethod.id
      });

    } catch (error: any) {
      onError(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-form">
      <div className="payment-header">
        <h2>Complete your payment</h2>
        <div className="security-badge">
          <Lock size={16} />
          <span>Secure payment</span>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <div className="summary-item">
          <span className="item-label">Property:</span>
          <span className="item-value">{bookingDetails.listingTitle}</span>
        </div>
        <div className="summary-item">
          <span className="item-label">Check-in:</span>
          <span className="item-value">{formatDate(bookingDetails.checkIn)}</span>
        </div>
        <div className="summary-item">
          <span className="item-label">Check-out:</span>
          <span className="item-value">{formatDate(bookingDetails.checkOut)}</span>
        </div>
        <div className="summary-item">
          <span className="item-label">Guests:</span>
          <span className="item-value">{bookingDetails.guests}</span>
        </div>
        <div className="summary-item">
          <span className="item-label">Nights:</span>
          <span className="item-value">{bookingDetails.nights}</span>
        </div>
        <div className="summary-total">
          <span className="total-label">Total:</span>
          <span className="total-amount">{formatPrice(amount)}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="payment-methods">
        <h3>Payment Method</h3>
        <div className="method-options">
          <label className={`method-option ${paymentMethod === 'demo' ? 'selected' : ''}`}>
            <input
              type="radio"
              value="demo"
              checked={paymentMethod === 'demo'}
              onChange={(e) => setPaymentMethod(e.target.value as 'demo')}
            />
            <div className="method-content">
              <Check size={16} />
              <span>Demo Payment (Test Mode)</span>
            </div>
          </label>
          
          <label className={`method-option ${paymentMethod === 'credit_card' ? 'selected' : ''}`}>
            <input
              type="radio"
              value="credit_card"
              checked={paymentMethod === 'credit_card'}
              onChange={(e) => setPaymentMethod(e.target.value as 'credit_card')}
            />
            <div className="method-content">
              <CreditCard size={16} />
              <span>Credit/Debit Card</span>
            </div>
          </label>
        </div>
      </div>

      {paymentMethod === 'demo' ? (
        <div className="demo-payment">
          <div className="demo-notice">
            <AlertCircle size={20} />
            <div>
              <h4>Demo Mode</h4>
              <p>This is a demonstration payment. No real money will be charged.</p>
            </div>
          </div>
          
          <div className="payment-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDemoPayment}
              className="btn btn-primary"
              disabled={processing}
            >
              {processing ? 'Processing...' : `Pay ${formatPrice(amount)} (Demo)`}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleStripePayment} className="stripe-form">
          {/* Billing Details */}
          <div className="billing-details">
            <h4>Billing Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={billingDetails.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={billingDetails.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address.line1">Address</label>
              <input
                type="text"
                id="address.line1"
                name="address.line1"
                value={billingDetails.address.line1}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.city">City</label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={billingDetails.address.city}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address.state">State</label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={billingDetails.address.state}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address.postal_code">ZIP Code</label>
                <input
                  type="text"
                  id="address.postal_code"
                  name="address.postal_code"
                  value={billingDetails.address.postal_code}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div className="card-details">
            <h4>Card Information</h4>
            <div className="card-element-container">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="payment-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={processing || !stripe}
            >
              {processing ? 'Processing...' : `Pay ${formatPrice(amount)}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
