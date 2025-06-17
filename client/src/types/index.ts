export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'guest' | 'host' | 'admin';
  avatar?: string;
  phone?: string;
  bio?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface ListingImage {
  url: string;
  alt?: string;
}

export interface Capacity {
  guests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
}

export interface Rules {
  checkIn: string;
  checkOut: string;
  minStay: number;
  maxStay: number;
}

export interface Rating {
  average: number;
  count: number;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'villa' | 'studio' | 'loft' | 'cabin' | 'other';
  location: Location;
  price: number;
  currency: string;
  images: ListingImage[];
  amenities: string[];
  capacity: Capacity;
  rules: Rules;
  host: User;
  isActive: boolean;
  rating: Rating;
  bookedDates: Array<{
    startDate: string;
    endDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GuestDetails {
  name: string;
  email: string;
  phone: string;
}

export interface BookingReview {
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  listing: Listing;
  guest: User;
  host: User;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  specialRequests?: string;
  guestDetails: GuestDetails;
  cancellationReason?: string;
  review?: BookingReview;
  nights: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  city?: string;
  state?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  type?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
