import React, { useEffect, useRef, useState, memo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
  }>;
  className?: string;
  onClick?: (lat: number, lng: number) => void;
  apiKey?: string;
  fallbackMessage?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  zoom = 12,
  markers = [],
  className = '',
  onClick,
  apiKey,
  fallbackMessage
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we have a valid API key
  const hasValidApiKey = apiKey && apiKey !== 'AIzaSyD-mock-key-replace-with-actual' && apiKey.trim() !== '';

  useEffect(() => {
    const initMap = async () => {
      // If no valid API key, show fallback immediately
      if (!hasValidApiKey) {
        setError('Google Maps API key not configured');
        setIsLoading(false);
        setIsLoaded(true);
        return;
      }

      try {
        setIsLoading(true);
        const loader = new Loader({
          apiKey: apiKey!,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: 'cooperative'
        });

        setMap(mapInstance);
        setIsLoaded(true);
        setIsLoading(false);

        // Add click listener if provided
        if (onClick) {
          mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              onClick(event.latLng.lat(), event.latLng.lng());
            }
          });
        }

      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError(`Failed to load Google Maps: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
        setIsLoaded(true);
      }
    };

    initMap();
  }, [center, zoom, onClick, apiKey, hasValidApiKey]);

  useEffect(() => {
    if (!map || !isLoaded || error) return;

    // Clear existing markers
    // In a real implementation, you'd track markers and remove them properly
    const currentMarkers: google.maps.Marker[] = [];

    // Add new markers
    markers.forEach(marker => {
      try {
        const mapMarker = new google.maps.Marker({
          position: marker.position,
          map: map,
          title: marker.title || '',
          animation: google.maps.Animation.DROP,
        });

        currentMarkers.push(mapMarker);

        if (marker.info) {
          const infoWindow = new google.maps.InfoWindow({
            content: marker.info
          });

          mapMarker.addListener('click', () => {
            // Close other info windows first
            infoWindow.open(map, mapMarker);
          });
        }
      } catch (err) {
        console.error('Error adding marker:', err);
      }
    });

    // Cleanup function to remove markers when component unmounts or markers change
    return () => {
      currentMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, markers, isLoaded, error]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`map-container ${className}`} style={{ minHeight: '300px' }}>
        <div className="map-loading" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '100%',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          color: '#6c757d',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e9ecef',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }} />
          <p style={{ margin: '0', fontSize: '14px' }}>Loading map...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  // Error state - show fallback
  if (error) {
    const defaultMessage = hasValidApiKey 
      ? 'Unable to load Google Maps. Please check your internet connection and try again.'
      : 'Google Maps integration requires an API key. Add your Google Maps API key to enable full functionality.';

    return (
      <div className={`map-container ${className}`} style={{ minHeight: '300px' }}>
        <div className="map-fallback" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '100%',
          background: '#f8f9fa',
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          color: '#6c757d',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <h3 style={{ margin: '0 0 12px 0', color: '#495057' }}>Map Preview</h3>
          <p style={{ margin: '0 0 12px 0', fontWeight: '500' }}>
            Location: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
          </p>
          {markers.length > 0 && (
            <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
              📍 {markers.length} location{markers.length > 1 ? 's' : ''} available
            </p>
          )}
          <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.4' }}>
            {fallbackMessage || defaultMessage}
          </p>
          {!hasValidApiKey && (
            <div style={{ marginTop: '16px', padding: '12px', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', fontSize: '12px', color: '#856404' }}>
              <strong>Developer Note:</strong> Set the <code>apiKey</code> prop with your Google Maps API key
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`map-container ${className}`} style={{ minHeight: '300px' }}>
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '100%', minHeight: '300px' }}
      />
    </div>
  );
};

export default memo(GoogleMap);
