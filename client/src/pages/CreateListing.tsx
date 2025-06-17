import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { COUNTRIES, validatePostalCode, getCountryByCode } from '../utils/countries';
import { 
  Home, 
  Users, 
  Bed, 
  Bath, 
  Upload, 
  X, 
  Wifi,
  Car,
  Utensils,
  Tv,
  Waves,
  Dumbbell,
  Wind,
  Thermometer,
  Coffee,
  Cigarette,
  Dog,
  Baby,
  Shield,
  Camera,
  Mountain,
  TreePine,
  Flame,
  Snowflake,
  WashingMachine,
  Shirt,
  Briefcase,
  UtensilsCrossed,
  Bath as BathIcon,
  Sofa,
  Monitor,
  Speaker
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './CreateListing.css';

interface ListingFormData {
  title: string;
  description: string;
  type: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  price: number;
  currency: string;
  images: Array<{ url: string; alt: string }>;
  amenities: string[];
  capacity: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
  };
  rules: {
    checkIn: string;
    checkOut: string;
    minStay: number;
    maxStay: number;
  };
}

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Check if user is authenticated and is a host
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'host') {
      setError('Only hosts can create listings. Please contact support to upgrade your account.');
      return;
    }
  }, [user, navigate]);

  // Memoize availableAmenities to prevent recreation on each render
  const availableAmenities = useMemo(() => [
    // Internet & Entertainment
    { value: 'wifi', label: 'WiFi', icon: <Wifi size={20} />, category: 'Internet & Entertainment' },
    { value: 'tv', label: 'TV', icon: <Tv size={20} />, category: 'Internet & Entertainment' },
    { value: 'sound_system', label: 'Sound System', icon: <Speaker size={20} />, category: 'Internet & Entertainment' },
    
    // Kitchen & Dining
    { value: 'kitchen', label: 'Kitchen', icon: <Utensils size={20} />, category: 'Kitchen & Dining' },
    { value: 'coffee_maker', label: 'Coffee Maker', icon: <Coffee size={20} />, category: 'Kitchen & Dining' },
    { value: 'dining_table', label: 'Dining Table', icon: <UtensilsCrossed size={20} />, category: 'Kitchen & Dining' },
    
    // Bedroom & Bathroom
    { value: 'linens', label: 'Bed Linens', icon: <Bed size={20} />, category: 'Bedroom & Bathroom' },
    { value: 'towels', label: 'Towels', icon: <BathIcon size={20} />, category: 'Bedroom & Bathroom' },
    { value: 'hair_dryer', label: 'Hair Dryer', icon: <Wind size={20} />, category: 'Bedroom & Bathroom' },
    
    // Heating & Cooling
    { value: 'heating', label: 'Heating', icon: <Thermometer size={20} />, category: 'Heating & Cooling' },
    { value: 'air_conditioning', label: 'Air Conditioning', icon: <Snowflake size={20} />, category: 'Heating & Cooling' },
    { value: 'fireplace', label: 'Fireplace', icon: <Flame size={20} />, category: 'Heating & Cooling' },
    
    // Laundry & Cleaning
    { value: 'washer', label: 'Washer', icon: <WashingMachine size={20} />, category: 'Laundry & Cleaning' },
    { value: 'dryer', label: 'Dryer', icon: <Shirt size={20} />, category: 'Laundry & Cleaning' },
    
    // Parking & Transportation
    { value: 'parking', label: 'Free Parking', icon: <Car size={20} />, category: 'Parking & Transportation' },
    { value: 'garage_parking', label: 'Garage Parking', icon: <Home size={20} />, category: 'Parking & Transportation' },
    
    // Outdoor & Recreation
    { value: 'pool', label: 'Pool', icon: <Waves size={20} />, category: 'Outdoor & Recreation' },
    { value: 'gym', label: 'Gym', icon: <Dumbbell size={20} />, category: 'Outdoor & Recreation' },
    { value: 'garden', label: 'Garden', icon: <TreePine size={20} />, category: 'Outdoor & Recreation' },
    { value: 'balcony', label: 'Balcony', icon: <Mountain size={20} />, category: 'Outdoor & Recreation' },
    
    // Work & Business
    { value: 'workspace', label: 'Dedicated Workspace', icon: <Briefcase size={20} />, category: 'Work & Business' },
    { value: 'desk', label: 'Desk', icon: <Monitor size={20} />, category: 'Work & Business' },
    
    // Family & Accessibility
    { value: 'baby_safety_gates', label: 'Baby Safety Gates', icon: <Baby size={20} />, category: 'Family & Accessibility' },
    { value: 'pets_allowed', label: 'Pets Allowed', icon: <Dog size={20} />, category: 'Family & Accessibility' },
    
    // Safety & Security
    { value: 'smoke_detector', label: 'Smoke Detector', icon: <Shield size={20} />, category: 'Safety & Security' },
    { value: 'security_cameras', label: 'Security Cameras (exterior)', icon: <Camera size={20} />, category: 'Safety & Security' },
    
    // Living Area
    { value: 'living_area', label: 'Living Area', icon: <Sofa size={20} />, category: 'Living Area' },
    
    // Policies
    { value: 'smoking_allowed', label: 'Smoking Allowed', icon: <Cigarette size={20} />, category: 'Policies' },
    { value: 'breakfast', label: 'Breakfast Included', icon: <Coffee size={20} />, category: 'Special Services' }
  ], []);

  // Memoize grouped amenities to prevent recreation on each render
  const groupedAmenities = useMemo(() => {
    return availableAmenities.reduce((acc, amenity) => {
      if (!acc[amenity.category]) {
        acc[amenity.category] = [];
      }
      acc[amenity.category].push(amenity);
      return acc;
    }, {} as Record<string, typeof availableAmenities>);
  }, [availableAmenities]);
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    type: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'USA',
      zipCode: ''
    },
    price: 0,
    currency: 'USD',
    images: [],
    amenities: [],
    capacity: {
      guests: 1,
      bedrooms: 1,
      bathrooms: 1,
      beds: 1
    },
    rules: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      minStay: 1,
      maxStay: 30
    }
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: <Home size={24} /> },
    { value: 'house', label: 'House', icon: <Home size={24} /> },
    { value: 'villa', label: 'Villa', icon: <Home size={24} /> },
    { value: 'studio', label: 'Studio', icon: <Home size={24} /> },
    { value: 'loft', label: 'Loft', icon: <Home size={24} /> },
    { value: 'cabin', label: 'Cabin', icon: <Home size={24} /> },
    { value: 'other', label: 'Other', icon: <Home size={24} /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ListingFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Auto-set currency when country changes
    if (name === 'location.country') {
      const country = getCountryByCode(value);
      if (country) {
        setFormData(prev => ({
          ...prev,
          currency: country.currency
        }));
      }
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ListingFormData] as any),
          [child]: numValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || 0 : numValue
      }));
    }
  };

  const handleTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url, alt: '' }]
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageAltChange = (index: number, alt: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, alt } : img
      )
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.title.trim().length >= 5 && 
               formData.description.trim().length >= 20 && 
               formData.type;
      case 2:
        return formData.location.address.trim() && 
               formData.location.city.trim() && 
               formData.location.state.trim() && 
               formData.location.zipCode.trim() &&
               validatePostalCode(formData.location.country, formData.location.zipCode);
      case 3:
        return formData.price > 0 && 
               formData.capacity.guests > 0 && 
               formData.capacity.bedrooms >= 0 && 
               formData.capacity.bathrooms > 0 && 
               formData.capacity.beds > 0;
      case 4:
        return formData.images.length > 0;
      case 5:
        return true; // Amenities are optional
      default:
        return false;
    }
  };

  const nextStep = () => {
    console.log('nextStep called, current step:', currentStep);
    console.log('validateStep result:', validateStep(currentStep));
    if (validateStep(currentStep)) {
      const newStep = Math.min(currentStep + 1, 5);
      console.log('Moving to step:', newStep);
      setCurrentStep(newStep);
    } else {
      console.log('Step validation failed');
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Next button clicked');
    nextStep();
  };

  const prevStep = () => {
    console.log('prevStep called, current step:', currentStep);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Previous button clicked');
    prevStep();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called, current step:', currentStep);
    
    // Only allow submission on the final step
    if (currentStep !== 5) {
      console.log('Form submission prevented - not on final step');
      return;
    }
    
    // Validate all steps before submission
    const allStepsValid = [1, 2, 3, 4, 5].every(step => validateStep(step));
    console.log('All steps valid:', allStepsValid);
    
    if (!allStepsValid) {
      setError('Please complete all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/listings', formData);
      
      if (response.data.listing) {
        navigate('/host/dashboard');
      } else {
        setError('Failed to create listing');
      }
    } catch (error: any) {
      console.error('Error creating listing:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to create listings. Please ensure you have a host account.');
      } else {
        setError(error.response?.data?.message || 'Failed to create listing. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press in form inputs
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep !== 5) {
      e.preventDefault();
      console.log('Enter key pressed, preventing form submission on step:', currentStep);
      // Optionally trigger next step if current step is valid
      if (validateStep(currentStep)) {
        nextStep();
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Tell us about your place</h3>
            <p>Start with the basics - what makes your place special?</p>
            
            <div className="form-group">
              <label htmlFor="title">Property Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Cozy Downtown Apartment"
                className="form-control"
                maxLength={100}
              />
              <small>{formData.title.length}/100 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property, its features, and what makes it special..."
                className="form-control"
                rows={6}
                maxLength={2000}
              />
              <small>{formData.description.length}/2000 characters</small>
            </div>

            <div className="form-group">
              <label>Property Type *</label>
              <div className="type-grid">
                {propertyTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    className={`type-card ${formData.type === type.value ? 'selected' : ''}`}
                    onClick={() => handleTypeSelect(type.value)}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Where is your place located?</h3>
            <p>Help guests find your property with a clear address.</p>
            
            <div className="form-group">
              <label htmlFor="location.address">Street Address *</label>
              <input
                type="text"
                id="location.address"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                placeholder="123 Main Street"
                className="form-control"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location.city">City *</label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="location.state">State *</label>
                <input
                  type="text"
                  id="location.state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  placeholder="NY"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location.country">Country *</label>
                <select
                  id="location.country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="location.zipCode">ZIP/Postal Code *</label>
                <input
                  type="text"
                  id="location.zipCode"
                  name="location.zipCode"
                  value={formData.location.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001"
                  className="form-control"
                />
                {formData.location.zipCode && !validatePostalCode(formData.location.country, formData.location.zipCode) && (
                  <small className="form-error">Invalid postal code format for {getCountryByCode(formData.location.country)?.name}</small>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Set your price and capacity</h3>
            <p>Let guests know how much your place costs and how many people it accommodates.</p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price per night *</label>
                <div className="price-input">
                  <span className="currency-symbol">{getCountryByCode(formData.location.country)?.currencySymbol || '$'}</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleNumberChange}
                    placeholder="100"
                    className="form-control"
                    min="1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="currency">Currency *</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  {COUNTRIES.map(country => (
                    <option key={country.currency} value={country.currency}>
                      {country.currency} - {country.currencySymbol}
                    </option>
                  )).filter((option, index, self) => 
                    index === self.findIndex(o => o.key === option.key)
                  )}
                </select>
              </div>
            </div>

            <div className="capacity-section">
              <h4>Property Capacity</h4>
              <div className="capacity-grid">
                <div className="capacity-item">
                  <div className="capacity-label">
                    <Users size={20} />
                    <span>Guests</span>
                  </div>
                  <div className="capacity-controls">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        capacity: { ...prev.capacity, guests: Math.max(1, prev.capacity.guests - 1) }
                      }))}
                    >
                      -
                    </button>
                    <span>{formData.capacity.guests}</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        capacity: { ...prev.capacity, guests: prev.capacity.guests + 1 }
                      }))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="capacity-item">
                  <div className="capacity-label">
                    <Home size={20} />
                    <span>Bedrooms</span>
                  </div>
                  <div className="capacity-controls">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        capacity: { ...prev.capacity, bedrooms: Math.max(0, prev.capacity.bedrooms - 1) }
                      }))}
                    >
                      -
                    </button>
                    <span>{formData.capacity.bedrooms}</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        capacity: { ...prev.capacity, bedrooms: prev.capacity.bedrooms + 1 }
                      }))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="capacity-item">
                  <div className="capacity-label">
                    <Bath size={20} />
                    <span>Bathrooms</span>
                  </div>
                  <div className="capacity-controls">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        capacity: { ...prev.capacity, bathrooms: Math.max(0.5, prev.capacity.bathrooms - 0.5) }
                      }))}
                    >
                      -
                    </button>
                    <span>{formData.capacity.bathrooms}</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        capacity: { ...prev.capacity, bathrooms: prev.capacity.bathrooms + 0.5 }
                      }))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="capacity-item">
                  <div className="capacity-label">
                    <Bed size={20} />
                    <span>Beds</span>
                  </div>
                  <div className="capacity-controls">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        capacity: { ...prev.capacity, beds: Math.max(1, prev.capacity.beds - 1) }
                      }))}
                    >
                      -
                    </button>
                    <span>{formData.capacity.beds}</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        capacity: { ...prev.capacity, beds: prev.capacity.beds + 1 }
                      }))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>Add photos of your place</h3>
            <p>Show guests what your space looks like. You can add more photos later.</p>
            
            <div className="images-section">
              <div className="images-grid">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image.url} alt={image.alt || `Property image ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleImageRemove(index)}
                    >
                      <X size={16} />
                    </button>
                    <input
                      type="text"
                      placeholder="Image description (optional)"
                      value={image.alt}
                      onChange={(e) => handleImageAltChange(index, e.target.value)}
                      className="alt-input"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="add-image"
                  onClick={handleImageAdd}
                >
                  <Upload size={24} />
                  <span>Add Image</span>
                </button>
              </div>
              <p className="image-note">
                For now, please provide image URLs. Upload functionality will be added soon.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3>Amenities and house rules</h3>
            <p>Let guests know what your place offers and any important rules.</p>
            
            <div className="amenities-section">
              <h4>What amenities do you offer?</h4>
              <p className="amenities-description">Select all amenities that guests can enjoy at your place</p>
              
              {/* Group amenities by category */}
              {Object.entries(groupedAmenities).map(([category, amenities]) => (
                <div key={category} className="amenity-category">
                  <h5 className="category-title">{category}</h5>
                  <div className="amenities-grid">
                    {amenities.map(amenity => (
                      <button
                        key={amenity.value}
                        type="button"
                        className={`amenity-card ${formData.amenities.includes(amenity.value) ? 'selected' : ''}`}
                        onClick={() => handleAmenityToggle(amenity.value)}
                      >
                        <div className="amenity-icon">{amenity.icon}</div>
                        <span className="amenity-label">{amenity.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rules-section">
              <h4>House Rules</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rules.checkIn">Check-in Time</label>
                  <input
                    type="text"
                    id="rules.checkIn"
                    name="rules.checkIn"
                    value={formData.rules.checkIn}
                    onChange={handleInputChange}
                    placeholder="3:00 PM"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rules.checkOut">Check-out Time</label>
                  <input
                    type="text"
                    id="rules.checkOut"
                    name="rules.checkOut"
                    value={formData.rules.checkOut}
                    onChange={handleInputChange}
                    placeholder="11:00 AM"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rules.minStay">Minimum Stay (nights)</label>
                  <input
                    type="number"
                    id="rules.minStay"
                    name="rules.minStay"
                    value={formData.rules.minStay}
                    onChange={handleNumberChange}
                    className="form-control"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rules.maxStay">Maximum Stay (nights)</label>
                  <input
                    type="number"
                    id="rules.maxStay"
                    name="rules.maxStay"
                    value={formData.rules.maxStay}
                    onChange={handleNumberChange}
                    className="form-control"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) return <LoadingSpinner />;

  // Show error if user is not a host
  if (!user) {
    return (
      <div className="container">
        <div className="error-message">
          Please log in to create a listing.
          <button onClick={() => navigate('/login')} className="btn btn-primary mt-2">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'host') {
    return (
      <div className="container">
        <div className="error-message">
          Only hosts can create listings. Please contact support to upgrade your account.
          <button onClick={() => navigate('/')} className="btn btn-primary mt-2">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-listing-page">
      <div className="container">
        <div className="create-listing-header">
          <h1>Create a New Listing</h1>
          <p>Share your space with travelers from around the world</p>
        </div>

        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Basics'}
                  {step === 2 && 'Location'}
                  {step === 3 && 'Pricing'}
                  {step === 4 && 'Photos'}
                  {step === 5 && 'Amenities'}
                </div>
              </div>
            ))}
          </div>
          <div className="progress-line">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep - 1) * 25}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="create-listing-form">
          {renderStepContent()}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={handlePrevClick} className="btn btn-outline">
                Previous
              </button>
            )}
            
            {currentStep < 5 ? (
              <button 
                type="button" 
                onClick={handleNextClick} 
                className="btn btn-primary"
                disabled={!validateStep(currentStep)}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
