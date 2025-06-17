import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Listing } from '../types';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { MapPin, Users, Star, Calendar, Wifi, Car, Utensils, Home, Tv, Waves, Dumbbell, Wind, Thermometer, Coffee, Cigarette, Dog, Baby, Shield, Camera, Mountain, TreePine, Flame, Snowflake, WashingMachine, Shirt, Briefcase, UtensilsCrossed, Bath as BathIcon, Sofa, Monitor, Speaker, Bed } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BookingModal from '../components/booking/BookingModal';
import GoogleMap from '../components/maps/GoogleMap';
import './ListingDetails.css';

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchListing = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/listings/${id}`);
      setListing(response.data.listing);
    } catch (error: any) {
      console.error('Error fetching listing:', error);
      setError(error.response?.data?.message || 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id, fetchListing]);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      // Internet & Entertainment
      case 'wifi':
        return <Wifi size={20} />;
      case 'tv':
        return <Tv size={20} />;
      case 'sound_system':
        return <Speaker size={20} />;
      
      // Kitchen & Dining
      case 'kitchen':
        return <Utensils size={20} />;
      case 'coffee_maker':
        return <Coffee size={20} />;
      case 'dining_table':
        return <UtensilsCrossed size={20} />;
      
      // Bedroom & Bathroom
      case 'linens':
        return <Bed size={20} />;
      case 'towels':
        return <BathIcon size={20} />;
      case 'hair_dryer':
        return <Wind size={20} />;
      
      // Heating & Cooling
      case 'heating':
        return <Thermometer size={20} />;
      case 'air_conditioning':
        return <Snowflake size={20} />;
      case 'fireplace':
        return <Flame size={20} />;
      
      // Laundry & Cleaning
      case 'washer':
        return <WashingMachine size={20} />;
      case 'dryer':
        return <Shirt size={20} />;
      
      // Parking & Transportation
      case 'parking':
      case 'garage_parking':
        return <Car size={20} />;
      
      // Outdoor & Recreation
      case 'pool':
        return <Waves size={20} />;
      case 'gym':
        return <Dumbbell size={20} />;
      case 'garden':
        return <TreePine size={20} />;
      case 'balcony':
        return <Mountain size={20} />;
      
      // Work & Business
      case 'workspace':
        return <Briefcase size={20} />;
      case 'desk':
        return <Monitor size={20} />;
      
      // Family & Accessibility
      case 'baby_safety_gates':
        return <Baby size={20} />;
      case 'pets_allowed':
        return <Dog size={20} />;
      
      // Safety & Security
      case 'smoke_detector':
        return <Shield size={20} />;
      case 'security_cameras':
        return <Camera size={20} />;
      
      // Living Area
      case 'living_area':
        return <Sofa size={20} />;
      
      // Policies
      case 'smoking_allowed':
        return <Cigarette size={20} />;
      case 'breakfast':
        return <Coffee size={20} />;
      
      default:
        return <Home size={20} />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    navigate('/my-bookings');
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          {error}
          <button onClick={() => navigate('/')} className="btn btn-primary mt-2">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container">
        <div className="error-message">
          Listing not found
          <button onClick={() => navigate('/')} className="btn btn-primary mt-2">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-details">
      <div className="container">
        {/* Header */}
        <div className="listing-header">
          <div className="listing-title-section">
            <h1 className="listing-title">{listing.title}</h1>
            <div className="listing-meta">
              <div className="listing-location">
                <MapPin size={16} />
                <span>{listing.location.address}, {listing.location.city}, {listing.location.state}</span>
              </div>
              {listing.rating.count > 0 && (
                <div className="listing-rating">
                  <Star size={16} fill="currentColor" />
                  <span>{listing.rating.average.toFixed(1)} ({listing.rating.count} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img
              src={listing.images[currentImageIndex]?.url || '/placeholder-image.jpg'}
              alt={listing.images[currentImageIndex]?.alt || listing.title}
              className="gallery-image"
            />
          </div>
          {listing.images.length > 1 && (
            <div className="image-thumbnails">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={image.url} alt={image.alt || `Image ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="listing-content">
          <div className="listing-main">
            {/* Property Details */}
            <div className="property-details">
              <div className="property-type">
                <span className="badge badge-primary">{listing.type}</span>
              </div>
              <div className="property-capacity">
                <div className="capacity-item">
                  <Users size={16} />
                  <span>{listing.capacity.guests} guests</span>
                </div>
                <div className="capacity-item">
                  <span>{listing.capacity.bedrooms} bedrooms</span>
                </div>
                <div className="capacity-item">
                  <span>{listing.capacity.bathrooms} bathrooms</span>
                </div>
                <div className="capacity-item">
                  <span>{listing.capacity.beds} beds</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <h2>About this place</h2>
              <p className="description-text">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div className="amenities-section">
              <h2>What this place offers</h2>
              <div className="amenities-grid">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <div className="amenity-icon">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="amenity-text">
                      {amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
              {listing.amenities.length === 0 && (
                <p className="no-amenities">No amenities listed for this property.</p>
              )}
            </div>

            {/* Rules */}
            <div className="rules-section">
              <h2>House Rules</h2>
              <div className="rules-grid">
                <div className="rule-item">
                  <Calendar size={16} />
                  <div>
                    <span>Check-in: {listing.rules.checkIn}</span>
                    <span>Check-out: {listing.rules.checkOut}</span>
                  </div>
                </div>
                <div className="rule-item">
                  <span>Minimum stay: {listing.rules.minStay} night{listing.rules.minStay > 1 ? 's' : ''}</span>
                </div>
                <div className="rule-item">
                  <span>Maximum stay: {listing.rules.maxStay} nights</span>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="location-section">
              <h2>Location</h2>
              <div className="location-info">
                <div className="location-details">
                  <div className="location-address">
                    <MapPin size={20} />
                    <div>
                      <p className="address-line">{listing.location.address}</p>
                      <p className="address-line">{listing.location.city}, {listing.location.state} {listing.location.zipCode}</p>
                      <p className="address-line">{listing.location.country}</p>
                    </div>
                  </div>
                </div>
                <div className="location-map">
                  <GoogleMap
                    center={{
                      lat: listing.location.latitude || 37.7749,
                      lng: listing.location.longitude || -122.4194
                    }}
                    zoom={15}
                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    markers={[
                      {
                        id: listing._id,
                        position: {
                          lat: listing.location.latitude || 37.7749,
                          lng: listing.location.longitude || -122.4194
                        },
                        title: listing.title,
                        info: `
                          <div class="map-marker-info">
                            <h4>${listing.title}</h4>
                            <p>${listing.location.address}</p>
                            <p>${listing.location.city}, ${listing.location.state}</p>
                          </div>
                        `
                      }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Host Information */}
            <div className="host-section">
              <h2>Meet your host</h2>
              <div className="host-card">
                <div className="host-avatar">
                  {listing.host.avatar ? (
                    <img src={listing.host.avatar} alt={listing.host.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {listing.host.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="host-info">
                  <h3>{listing.host.name}</h3>
                  <p className="host-role">Host</p>
                  {listing.host.bio && <p className="host-bio">{listing.host.bio}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <div className="booking-price">
                <span className="price-amount">{formatPrice(listing.price)}</span>
                <span className="price-period">per night</span>
              </div>
              
              {listing.rating.count > 0 && (
                <div className="booking-rating">
                  <Star size={16} fill="currentColor" />
                  <span>{listing.rating.average.toFixed(1)}</span>
                  <span className="rating-count">({listing.rating.count} reviews)</span>
                </div>
              )}

              <button 
                onClick={handleBookNow}
                className="btn btn-primary booking-button"
              >
                {user ? 'Reserve Now' : 'Sign in to Book'}
              </button>

              <p className="booking-note">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && listing && (
        <BookingModal
          listing={listing}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default ListingDetails;
