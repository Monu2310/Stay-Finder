import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { formatPrice } from '../utils/countries';
import {
  PlusCircle,
  Home,
  BarChart3,
  Calendar,
  MessageSquare,
  Settings,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Listing, Booking } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './HostDashboard.css';

interface DashboardStats {
  totalListings: number;
  activeBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

const HostDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'bookings'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch host's listings
      const listingsResponse = await api.get('/listings/host/my-listings');
      const hostListings = listingsResponse.data.listings;
      setListings(hostListings);

      // Fetch host's bookings
      const bookingsResponse = await api.get('/bookings/host-bookings');
      const hostBookings = bookingsResponse.data.bookings;
      setRecentBookings(hostBookings.slice(0, 5)); // Show only recent 5

      // Calculate stats
      const totalRevenue = hostBookings
        .filter((booking: Booking) => booking.status === 'completed')
        .reduce((sum: number, booking: Booking) => sum + booking.totalPrice, 0);

      const activeBookings = hostBookings.filter(
        (booking: Booking) => booking.status === 'confirmed' || booking.status === 'pending'
      ).length;

      const allRatings = hostListings
        .filter((listing: Listing) => listing.rating.count > 0)
        .map((listing: Listing) => listing.rating.average);
        
      const averageRating = allRatings.length > 0 
        ? allRatings.reduce((sum: number, rating: number) => sum + rating, 0) / allRatings.length 
        : 0;

      const totalReviews = hostListings.reduce(
        (sum: number, listing: Listing) => sum + listing.rating.count, 0
      );

      setStats({
        totalListings: hostListings.length,
        activeBookings,
        totalRevenue,
        averageRating,
        totalReviews
      });

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleListingToggleActive = async (listingId: string, isActive: boolean) => {
    try {
      await api.put(`/listings/${listingId}`, { isActive: !isActive });
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  const handleListingDelete = async (listingId: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/listings/${listingId}`);
        await fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  const handleBookingStatusUpdate = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError('Failed to update booking status. Please try again.');
    }
  };

  // Remove the local formatPrice function as we're using the one from utils/countries

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBookingStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'badge-warning', icon: <Clock size={14} /> },
      confirmed: { class: 'badge-success', icon: <CheckCircle size={14} /> },
      completed: { class: 'badge-success', icon: <CheckCircle size={14} /> },
      cancelled: { class: 'badge-danger', icon: <AlertCircle size={14} /> }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        {config.icon}
        {status}
      </span>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="host-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Host Dashboard</h1>
            <p>Welcome back, {user?.name}! Manage your properties and bookings</p>
          </div>
          <Link to="/host/create-listing" className="btn btn-primary">
            <PlusCircle size={20} />
            Add New Listing
          </Link>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchDashboardData} className="btn btn-outline btn-sm">
              Try Again
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <Home size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Properties</h3>
              <p className="stat-number">{stats.totalListings}</p>
              <p className="stat-change">
                {listings.filter(l => l.isActive).length} active
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <h3>Active Bookings</h3>
              <p className="stat-number">{stats.activeBookings}</p>
              <p className="stat-change">Current reservations</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-number">{formatPrice(stats.totalRevenue, 'USD')}</p>
              <p className="stat-change">Completed bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <MessageSquare size={24} />
            </div>
            <div className="stat-content">
              <h3>Reviews</h3>
              <p className="stat-number">{stats.totalReviews}</p>
              <p className="stat-change">
                {stats.averageRating > 0 && (
                  <>
                    <Star size={14} fill="currentColor" />
                    {stats.averageRating.toFixed(1)} avg
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Listings ({listings.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Recent Bookings ({recentBookings.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="overview-section">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <Link to="/host/create-listing" className="quick-action-card">
                    <PlusCircle size={24} />
                    <span>Add New Listing</span>
                  </Link>
                  <Link to="/profile" className="quick-action-card">
                    <Settings size={24} />
                    <span>Account Settings</span>
                  </Link>
                  <Link to="/my-bookings" className="quick-action-card">
                    <Calendar size={24} />
                    <span>View All Bookings</span>
                  </Link>
                </div>
              </div>

              {recentBookings.length > 0 && (
                <div className="overview-section">
                  <h3>Recent Booking Requests</h3>
                  <div className="recent-bookings">
                    {recentBookings.slice(0, 3).map(booking => (
                      <div key={booking._id} className="booking-summary">
                        <div className="booking-info">
                          <h4>{booking.listing.title}</h4>
                          <p>Guest: {booking.guest.name}</p>
                          <p>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</p>
                        </div>
                        <div className="booking-actions">
                          {getBookingStatusBadge(booking.status)}
                          <span className="booking-price">{formatPrice(booking.totalPrice, booking.listing.currency)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="listings-content">
              {listings.length === 0 ? (
                <div className="empty-state">
                  <Home size={48} />
                  <h3>No listings yet</h3>
                  <p>Create your first listing to start hosting guests</p>
                  <Link to="/host/create-listing" className="btn btn-primary">
                    Create Your First Listing
                  </Link>
                </div>
              ) : (
                <div className="listings-grid">
                  {listings.map(listing => (
                    <div key={listing._id} className="listing-management-card">
                      <div className="listing-image">
                        <img 
                          src={listing.images[0]?.url || '/placeholder-image.jpg'} 
                          alt={listing.title}
                        />
                        <div className="listing-status">
                          <span className={`status-badge ${listing.isActive ? 'active' : 'inactive'}`}>
                            {listing.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="listing-details">
                        <h4>{listing.title}</h4>
                        <div className="listing-meta">
                          <div className="meta-item">
                            <MapPin size={14} />
                            <span>{listing.location.city}, {listing.location.state}</span>
                          </div>
                          <div className="meta-item">
                            <DollarSign size={14} />
                            <span>{formatPrice(listing.price, listing.currency)}/night</span>
                          </div>
                          <div className="meta-item">
                            <Users size={14} />
                            <span>{listing.capacity.guests} guests</span>
                          </div>
                          {listing.rating.count > 0 && (
                            <div className="meta-item">
                              <Star size={14} fill="currentColor" />
                              <span>{listing.rating.average.toFixed(1)} ({listing.rating.count})</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="listing-actions">
                          <Link 
                            to={`/listing/${listing._id}`} 
                            className="btn btn-outline btn-sm"
                          >
                            <Eye size={16} />
                            View
                          </Link>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => handleListingToggleActive(listing._id, listing.isActive)}
                          >
                            {listing.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleListingDelete(listing._id)}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-content">
              {recentBookings.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={48} />
                  <h3>No bookings yet</h3>
                  <p>Your booking requests will appear here</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {recentBookings.map(booking => (
                    <div key={booking._id} className="booking-management-card">
                      <div className="booking-header">
                        <div className="booking-info">
                          <h4>{booking.listing.title}</h4>
                          <p className="guest-name">Guest: {booking.guest.name}</p>
                        </div>
                        {getBookingStatusBadge(booking.status)}
                      </div>
                      
                      <div className="booking-details">
                        <div className="booking-dates">
                          <Calendar size={16} />
                          <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                          <span className="nights">({booking.nights} nights)</span>
                        </div>
                        <div className="booking-guests">
                          <Users size={16} />
                          <span>{booking.guests} guests</span>
                        </div>
                        <div className="booking-total">
                          <DollarSign size={16} />
                          <span>{formatPrice(booking.totalPrice, booking.listing.currency)}</span>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="special-requests">
                          <strong>Special Requests:</strong>
                          <p>{booking.specialRequests}</p>
                        </div>
                      )}

                      {booking.status === 'pending' && (
                        <div className="booking-actions">
                          <button
                            onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
                            className="btn btn-success btn-sm"
                          >
                            <CheckCircle size={16} />
                            Confirm Booking
                          </button>
                          <button
                            onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
                            className="btn btn-danger btn-sm"
                          >
                            <XCircle size={16} />
                            Decline Booking
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
