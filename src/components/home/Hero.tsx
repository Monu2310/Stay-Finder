import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <h1 className="hero-title">
              Find Your Perfect Stay
            </h1>
            <p className="hero-subtitle">
              Discover amazing places to stay around the world. From cozy apartments to luxury villas, 
              find the perfect accommodation for your next adventure.
            </p>
          </div>
        </div>
      </div>
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <img 
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop"
          alt="Beautiful modern home"
          className="hero-image"
        />
      </div>
    </section>
  );
};

export default Hero;
