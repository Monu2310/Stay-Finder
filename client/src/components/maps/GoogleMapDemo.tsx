import React from 'react';
import GoogleMap from './GoogleMap';

// Demo component showing different GoogleMap usage scenarios
const GoogleMapDemo: React.FC = () => {
  const sampleLocations = [
    {
      id: '1',
      position: { lat: 37.7749, lng: -122.4194 },
      title: 'San Francisco',
      info: '<div style="padding: 10px;"><h3 style="margin: 0 0 8px 0;">San Francisco</h3><p style="margin: 0;">Beautiful city by the bay</p></div>'
    },
    {
      id: '2',
      position: { lat: 37.7849, lng: -122.4094 },
      title: 'Property 1',
      info: '<div style="padding: 10px;"><h3 style="margin: 0 0 8px 0;">Luxury Apartment</h3><p style="margin: 0;">$200/night • ⭐ 4.8</p></div>'
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Google Maps Component Demo</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2>1. Without API Key (Shows Fallback)</h2>
        <p>This demonstrates the graceful fallback when no API key is provided:</p>
        <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <GoogleMap
            center={{ lat: 37.7749, lng: -122.4194 }}
            zoom={12}
            markers={sampleLocations}
          />
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>2. With API Key (Actual Map)</h2>
        <p>This will show the actual Google Map when a valid API key is provided:</p>
        <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <GoogleMap
            center={{ lat: 37.7749, lng: -122.4194 }}
            zoom={12}
            markers={sampleLocations}
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          />
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>3. Custom Fallback Message</h2>
        <div style={{ height: '300px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <GoogleMap
            center={{ lat: 40.7128, lng: -74.0060 }}
            zoom={10}
            fallbackMessage="This property location will be shown on an interactive map once you book."
          />
        </div>
      </div>

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Setup Instructions:</h3>
        <ol>
          <li>Get a Google Maps API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
          <li>Enable the Maps JavaScript API</li>
          <li>Create a <code>.env</code> file with: <code>REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here</code></li>
          <li>Restart the development server</li>
        </ol>
      </div>
    </div>
  );
};

export default GoogleMapDemo;
