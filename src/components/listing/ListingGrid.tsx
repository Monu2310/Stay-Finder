import React, { useState } from 'react';
import ListingCard from './ListingCard';
import { Listing } from '../../types';
import './ListingGrid.css';

interface ListingGridProps {
  listings: Listing[];
  userFavorites?: string[];
  onFavoriteToggle?: (listingId: string, isFavorite: boolean) => void;
}

const ListingGrid: React.FC<ListingGridProps> = ({ 
  listings, 
  userFavorites = [], 
  onFavoriteToggle 
}) => {
  const [favorites, setFavorites] = useState<string[]>(userFavorites);

  const handleFavoriteToggle = (listingId: string, isFavorite: boolean) => {
    setFavorites(prev => 
      isFavorite 
        ? [...prev, listingId]
        : prev.filter(id => id !== listingId)
    );
    onFavoriteToggle?.(listingId, isFavorite);
  };

  return (
    <div className="listing-grid" role="grid">
      {listings.map((listing, index) => (
        <div key={listing._id} className="listing-grid-item" role="gridcell">
          <ListingCard
            listing={listing}
            isFavorite={favorites.includes(listing._id)}
            onFavoriteToggle={handleFavoriteToggle}
            priority={index < 4} // Prioritize first 4 images for loading
            showFavoriteButton={true}
            showShareButton={true}
          />
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;
