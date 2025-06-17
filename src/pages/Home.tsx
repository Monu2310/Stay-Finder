import React, { useState, useEffect, useCallback } from 'react';
import { Listing, SearchFilters } from '../types';
import api from '../utils/api';
import SearchBar from '../components/search/SearchBar';
import ListingCard from '../components/listing/ListingCard';
import ListingsMap from '../components/maps/ListingsMap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Hero from '../components/home/Hero';
import { Map, Grid } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.guests) params.append('guests', filters.guests.toString());
      if (filters.type) params.append('type', filters.type);
      if (filters.checkIn) params.append('checkIn', filters.checkIn);
      if (filters.checkOut) params.append('checkOut', filters.checkOut);

      const response = await api.get(`/listings?${params.toString()}`);
      setListings(response.data.listings);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (loading && listings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="home">
      <Hero />
      
      <div className="container">
        <section className="search-section">
          <SearchBar onSearch={handleSearch} />
        </section>

        <section className="listings-section">
          <div className="section-header">
            <h2 className="section-title">
              {Object.keys(filters).length > 0 ? 'Search Results' : 'Featured Properties'}
            </h2>
            <div className="section-controls">
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                >
                  <Grid size={18} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
                >
                  <Map size={18} />
                  Map
                </button>
              </div>
              {Object.keys(filters).length > 0 && (
                <button 
                  onClick={clearFilters}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {error ? (
            <div className="error-message">
              {error}
              <button onClick={fetchListings} className="btn btn-primary mt-2">
                Try Again
              </button>
            </div>
          ) : (
            <>
              {loading && (
                <div className="flex-center">
                  <div className="spinner"></div>
                </div>
              )}
              
              {listings.length === 0 && !loading ? (
                <div className="no-results">
                  <h3>No properties found</h3>
                  <p>Try adjusting your search criteria or browse all available properties.</p>
                  <button onClick={clearFilters} className="btn btn-primary mt-2">
                    Show All Properties
                  </button>
                </div>
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <div className="listings-grid">
                      {listings.map((listing) => (
                        <ListingCard key={listing._id} listing={listing} />
                      ))}
                    </div>
                  ) : (
                    <div className="listings-map-container">
                      <ListingsMap 
                        listings={listings}
                        height="600px"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
