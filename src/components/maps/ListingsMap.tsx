import React, { useState, useEffect } from 'react';
import { Listing } from '../../types';
import GoogleMap from './GoogleMap';
import { formatPrice } from '../../utils/countries';
import './ListingsMap.css';

interface ListingsMapProps {
  listings: Listing[];
  selectedListing?: Listing | null;
  onListingSelect?: (listing: Listing) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

const ListingsMap: React.FC<ListingsMapProps> = ({
  listings,
  selectedListing,
  onListingSelect,
  center,
  zoom = 12,
  height = '400px'
}) => {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(() => {
    if (center) return center;
    
    // Calculate center from listings
    if (listings.length > 0) {
      const avgLat = listings.reduce((sum, listing) => sum + (listing.location.latitude || 0), 0) / listings.length;
      const avgLng = listings.reduce((sum, listing) => sum + (listing.location.longitude || 0), 0) / listings.length;
      return { lat: avgLat, lng: avgLng };
    }
    
    // Default to San Francisco
    return { lat: 37.7749, lng: -122.4194 };
  });

  useEffect(() => {
    if (selectedListing && selectedListing.location.latitude && selectedListing.location.longitude) {
      setMapCenter({
        lat: selectedListing.location.latitude,
        lng: selectedListing.location.longitude
      });
    }
  }, [selectedListing]);

  const markers = listings
    .filter(listing => listing.location.latitude && listing.location.longitude)
    .map(listing => ({
      id: listing._id,
      position: {
        lat: listing.location.latitude!,
        lng: listing.location.longitude!
      },
      title: listing.title,
      info: `
        <div class="map-info-window">
          <div class="info-image">
            <img src="${listing.images[0]?.url || '/placeholder-image.jpg'}" alt="${listing.title}" />
          </div>
          <div class="info-content">
            <h4>${listing.title}</h4>
            <p class="info-location">${listing.location.city}, ${listing.location.state}</p>
            <p class="info-price">${formatPrice(listing.price)}/night</p>
            <a href="/listing/${listing._id}" class="info-link">View Details</a>
          </div>
        </div>
      `
    }));

  return (
    <div className="listings-map" style={{ height }}>
      <GoogleMap
        center={mapCenter}
        zoom={zoom}
        markers={markers}
        className="listings-google-map"
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      />
      
      {listings.length === 0 && (
        <div className="no-listings-overlay">
          <div className="no-listings-message">
            <h3>No properties to display</h3>
            <p>Adjust your search criteria to see properties on the map</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsMap;
