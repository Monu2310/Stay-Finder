import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../../types';
import { MapPin, Users, Star, Wifi, Car, Utensils, Tv, Waves, Dumbbell, Wind, Thermometer, Coffee, Dog, Baby, Shield, Camera, Mountain, TreePine, Flame, Snowflake, WashingMachine, Shirt, Briefcase, UtensilsCrossed, Bath as BathIcon, Sofa, Monitor, Speaker, Bed, Home, Heart, Share2, Award, Zap } from 'lucide-react';
import { formatPrice } from '../../utils/countries';
import './ListingCard.css';

interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle?: (listingId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
  showShareButton?: boolean;
  priority?: boolean; // For image loading priority
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onFavoriteToggle, 
  isFavorite = false, 
  showFavoriteButton = true,
  showShareButton = true,
  priority = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavoriteState = !localFavorite;
    setLocalFavorite(newFavoriteState);
    onFavoriteToggle?.(listing._id, newFavoriteState);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/listing/${listing._id}`;
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      // You could show a toast notification here
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      // Internet & Entertainment
      case 'wifi':
        return <Wifi size={14} />;
      case 'tv':
        return <Tv size={14} />;
      case 'sound_system':
        return <Speaker size={14} />;
      
      // Kitchen & Dining
      case 'kitchen':
        return <Utensils size={14} />;
      case 'coffee_maker':
        return <Coffee size={14} />;
      case 'dining_table':
        return <UtensilsCrossed size={14} />;
      
      // Bedroom & Bathroom
      case 'linens':
        return <Bed size={14} />;
      case 'towels':
        return <BathIcon size={14} />;
      case 'hair_dryer':
        return <Wind size={14} />;
      
      // Heating & Cooling
      case 'heating':
        return <Thermometer size={14} />;
      case 'air_conditioning':
        return <Snowflake size={14} />;
      case 'fireplace':
        return <Flame size={14} />;
      
      // Laundry & Cleaning
      case 'washer':
        return <WashingMachine size={14} />;
      case 'dryer':
        return <Shirt size={14} />;
      
      // Parking & Transportation
      case 'parking':
      case 'garage_parking':
        return <Car size={14} />;
      
      // Outdoor & Recreation
      case 'pool':
        return <Waves size={14} />;
      case 'gym':
        return <Dumbbell size={14} />;
      case 'garden':
        return <TreePine size={14} />;
      case 'balcony':
        return <Mountain size={14} />;
      
      // Work & Business
      case 'workspace':
        return <Briefcase size={14} />;
      case 'desk':
        return <Monitor size={14} />;
      
      // Family & Accessibility
      case 'baby_safety_gates':
        return <Baby size={14} />;
      case 'pets_allowed':
        return <Dog size={14} />;
      
      // Safety & Security
      case 'smoke_detector':
        return <Shield size={14} />;
      case 'security_cameras':
        return <Camera size={14} />;
      
      // Living Area
      case 'living_area':
        return <Sofa size={14} />;
      
      // Policies & Services
      case 'smoking_allowed':
        return <Flame size={14} />;
      case 'breakfast':
        return <Coffee size={14} />;
      
      default:
        return <Home size={14} />;
    }
  };

  const formatListingPrice = (price: number, currency: string) => {
    return formatPrice(price, currency);
  };

  const isNewListing = () => {
    const listingDate = new Date(listing.createdAt || '');
    const daysDiff = Math.floor((Date.now() - listingDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30; // Consider new if created within 30 days
  };

  const isSuperhost = () => {
    // You can implement superhost logic based on your criteria
    // For now, we'll use the listing's rating as a proxy
    return listing.rating.average >= 4.8 && listing.rating.count >= 25;
  };

  const getImageSrc = () => {
    if (imageError) return '/placeholder-image.jpg';
    return listing.images?.[0]?.url || '/placeholder-image.jpg';
  };

  const getImageAlt = () => {
    return listing.images?.[0]?.alt || `${listing.title} - ${listing.location.city}, ${listing.location.state}`;
  };

  return (
    <article className="listing-card">
      <Link 
        to={`/listing/${listing._id}`} 
        className="listing-card-link"
        aria-label={`View details for ${listing.title} in ${listing.location.city}`}
      >
        <div className="listing-image-container">
          {!imageLoaded && !imageError && (
            <div className="listing-image-skeleton" aria-hidden="true" />
          )}
          <img
            src={getImageSrc()}
            alt={getImageAlt()}
            className={`listing-image ${imageLoaded ? 'loaded' : ''}`}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            width="400"
            height="250"
          />
          
          {/* Badges */}
          <div className="listing-badges">
            <span className="listing-type-badge" aria-label={`Property type: ${listing.type}`}>
              {listing.type}
            </span>
            {isNewListing() && (
              <span className="new-listing-badge" aria-label="New listing">
                <Zap size={12} />
                New
              </span>
            )}
            {isSuperhost() && (
              <span className="superhost-badge" aria-label="Superhost">
                <Award size={12} />
                Superhost
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="listing-actions">
            {showFavoriteButton && (
              <button
                className={`action-button favorite-button ${localFavorite ? 'active' : ''}`}
                onClick={handleFavoriteClick}
                aria-label={localFavorite ? 'Remove from favorites' : 'Add to favorites'}
                type="button"
              >
                <Heart size={16} fill={localFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
            {showShareButton && (
              <button
                className="action-button share-button"
                onClick={handleShareClick}
                aria-label="Share this listing"
                type="button"
              >
                <Share2 size={16} />
              </button>
            )}
          </div>

          {/* Rating */}
          {listing.rating.count > 0 && (
            <div className="listing-rating" aria-label={`Rating: ${listing.rating.average.toFixed(1)} out of 5 stars`}>
              <Star size={14} fill="currentColor" aria-hidden="true" />
              <span>{listing.rating.average.toFixed(1)}</span>
              <span className="rating-count">({listing.rating.count})</span>
            </div>
          )}
        </div>
        
        <div className="listing-content">
          <div className="listing-header">
            <h3 className="listing-title">{listing.title}</h3>
            <div className="listing-location">
              <MapPin size={14} aria-hidden="true" />
              <span>{listing.location.city}, {listing.location.state}</span>
            </div>
          </div>

          <p className="listing-description">
            {listing.description.length > 120 
              ? `${listing.description.substring(0, 120)}...` 
              : listing.description}
          </p>

          <div className="listing-details">
            <div className="listing-capacity" aria-label="Property capacity">
              <Users size={14} aria-hidden="true" />
              <span>{listing.capacity.guests} guests</span>
              <span aria-hidden="true">•</span>
              <span>{listing.capacity.bedrooms} {listing.capacity.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
              <span aria-hidden="true">•</span>
              <span>{listing.capacity.bathrooms} {listing.capacity.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</span>
            </div>

            <div className="listing-amenities" role="list" aria-label="Key amenities">
              {listing.amenities.slice(0, 4).map((amenity, index) => (
                <span key={index} className="amenity-item" role="listitem">
                  {getAmenityIcon(amenity)}
                  <span>{amenity.replace(/_/g, ' ')}</span>
                </span>
              ))}
              {listing.amenities.length > 4 && (
                <span className="amenity-more" aria-label={`${listing.amenities.length - 4} more amenities available`}>
                  +{listing.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>

          <div className="listing-footer">
            <div className="listing-price" aria-label={`Price: ${formatListingPrice(listing.price, listing.currency || 'USD')} per night`}>
              <span className="price-amount">
                {formatListingPrice(listing.price, listing.currency || 'USD')}
              </span>
              <span className="price-period">/ night</span>
            </div>
            <div className="listing-host">
              <span>Hosted by {listing.host.name}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default memo(ListingCard);
