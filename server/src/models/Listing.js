const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'villa', 'studio', 'loft', 'cabin', 'other']
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      default: 0
    },
    longitude: {
      type: Number,
      default: 0
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  amenities: [{
    type: String,
    enum: [
      // Internet & Entertainment
      'wifi', 'tv', 'sound_system',
      
      // Kitchen & Dining
      'kitchen', 'coffee_maker', 'dining_table',
      
      // Bedroom & Bathroom
      'linens', 'towels', 'hair_dryer',
      
      // Heating & Cooling
      'heating', 'air_conditioning', 'fireplace',
      
      // Laundry & Cleaning
      'washer', 'dryer',
      
      // Parking & Transportation
      'parking', 'garage_parking',
      
      // Outdoor & Recreation
      'pool', 'gym', 'garden', 'balcony',
      
      // Work & Business
      'workspace', 'desk',
      
      // Family & Accessibility
      'baby_safety_gates', 'pets_allowed',
      
      // Safety & Security
      'smoke_detector', 'security_cameras',
      
      // Living Area
      'living_area',
      
      // Policies & Services
      'smoking_allowed', 'breakfast', 'events_allowed'
    ]
  }],
  capacity: {
    guests: {
      type: Number,
      required: true,
      min: 1
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0
    },
    beds: {
      type: Number,
      required: true,
      min: 1
    }
  },
  rules: {
    checkIn: {
      type: String,
      default: '3:00 PM'
    },
    checkOut: {
      type: String,
      default: '11:00 AM'
    },
    minStay: {
      type: Number,
      default: 1
    },
    maxStay: {
      type: Number,
      default: 30
    }
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  bookedDates: [{
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Index for search optimization
listingSchema.index({ 'location.city': 1, 'location.state': 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ 'capacity.guests': 1 });
listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);
