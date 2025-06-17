import React, { useState } from 'react';
import { SearchFilters } from '../../types';
import { Search, MapPin, Users, Calendar, DollarSign, Filter, X } from 'lucide-react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    guests: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    type: '',
    checkIn: '',
    checkOut: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name === 'guests' || name === 'minPrice' || name === 'maxPrice') ? Number(value) : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      guests: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      type: '',
      checkIn: '',
      checkOut: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' },
    { value: 'loft', label: 'Loft' },
    { value: 'cabin', label: 'Cabin' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-bar">
        {/* Main Search Row */}
        <div className="search-row main-search">
          <div className="search-field location-field">
            <label htmlFor="city" className="search-label">
              <MapPin size={16} />
              Location
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={filters.city || ''}
              onChange={handleInputChange}
              placeholder="Where are you going?"
              className="search-input"
            />
          </div>

          <div className="search-field date-field">
            <label htmlFor="checkIn" className="search-label">
              <Calendar size={16} />
              Check-in
            </label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={filters.checkIn || ''}
              onChange={handleInputChange}
              className="search-input date-input"
            />
          </div>

          <div className="search-field date-field">
            <label htmlFor="checkOut" className="search-label">
              <Calendar size={16} />
              Check-out
            </label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={filters.checkOut || ''}
              onChange={handleInputChange}
              className="search-input date-input"
            />
          </div>

          <div className="search-field guests-field">
            <label htmlFor="guests" className="search-label">
              <Users size={16} />
              Guests
            </label>
            <select
              id="guests"
              name="guests"
              value={filters.guests || ''}
              onChange={handleInputChange}
              className="search-select"
            >
              <option value="">Any</option>
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="search-actions">
            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`filter-toggle-btn ${showAdvanced ? 'active' : ''}`}
              title="Advanced Filters"
            >
              <Filter size={18} />
            </button>
            
            <button type="submit" className="search-button">
              <Search size={18} />
              <span className="search-button-text">Search</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="advanced-filters">
            <div className="advanced-row">
              <div className="search-field">
                <label htmlFor="type" className="search-label">
                  Property Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={filters.type || ''}
                  onChange={handleInputChange}
                  className="search-select"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-field price-field">
                <label htmlFor="minPrice" className="search-label">
                  <DollarSign size={16} />
                  Min Price
                </label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={filters.minPrice || ''}
                  onChange={handleInputChange}
                  placeholder="$0"
                  min="0"
                  className="search-input price-input"
                />
              </div>

              <div className="search-field price-field">
                <label htmlFor="maxPrice" className="search-label">
                  <DollarSign size={16} />
                  Max Price
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={filters.maxPrice || ''}
                  onChange={handleInputChange}
                  placeholder="$1000"
                  min="0"
                  className="search-input price-input"
                />
              </div>

              <div className="search-field">
                <button 
                  type="button" 
                  onClick={clearFilters} 
                  className="clear-filters-btn"
                  title="Clear all filters"
                >
                  <X size={16} />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};



export default SearchBar;
