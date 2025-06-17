import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Menu, X, Home, BookOpen, Settings, PlusCircle } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <Home size={24} />
            <span>StayFinder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-menu desktop-only">
            {user ? (
              <div className="navbar-user">
                <span className="navbar-welcome">Welcome, {user.name}</span>
                
                {user.role === 'host' && (
                  <>
                    <Link to="/host/dashboard" className="navbar-link">
                      <Settings size={18} />
                      Dashboard
                    </Link>
                    <Link to="/host/create-listing" className="navbar-link">
                      <PlusCircle size={18} />
                      Add Listing
                    </Link>
                  </>
                )}
                
                <Link to="/my-bookings" className="navbar-link">
                  <BookOpen size={18} />
                  My Bookings
                </Link>
                
                <Link to="/profile" className="navbar-link">
                  <User size={18} />
                  Profile
                </Link>
                
                <button onClick={handleLogout} className="btn btn-outline navbar-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="navbar-link">Login</Link>
                <Link to="/register" className="btn btn-primary navbar-btn">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button mobile-only"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              {user ? (
                <>
                  <div className="mobile-user-info">
                    <span className="mobile-welcome">Welcome, {user.name}</span>
                    <span className="mobile-role badge badge-primary">{user.role}</span>
                  </div>
                  
                  {user.role === 'host' && (
                    <>
                      <Link 
                        to="/host/dashboard" 
                        className="mobile-menu-link"
                        onClick={closeMenu}
                      >
                        <Settings size={18} />
                        Dashboard
                      </Link>
                      <Link 
                        to="/host/create-listing" 
                        className="mobile-menu-link"
                        onClick={closeMenu}
                      >
                        <PlusCircle size={18} />
                        Add Listing
                      </Link>
                    </>
                  )}
                  
                  <Link 
                    to="/my-bookings" 
                    className="mobile-menu-link"
                    onClick={closeMenu}
                  >
                    <BookOpen size={18} />
                    My Bookings
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className="mobile-menu-link"
                    onClick={closeMenu}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  
                  <button 
                    onClick={handleLogout} 
                    className="mobile-menu-button btn btn-danger"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="mobile-menu-link"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="mobile-menu-link"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
