# Google Maps Setup Guide

The error "This page didn't load Google Maps correctly" occurs because the application needs a valid Google Maps API key to function properly.

## Quick Fix

The application is currently showing a fallback interface instead of crashing. This is the improved error handling working as designed.

## To Enable Google Maps Functionality

### Step 1: Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API** (if using place search functionality)
4. Go to "Credentials" and create an API Key
5. (Optional) Restrict the API key to your domain for security

### Step 2: Set Up Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Step 3: Restart the Development Server

```bash
npm start
```

## What's Fixed in the GoogleMap Component

### ✅ Better Error Handling

- Detects invalid/missing API keys
- Shows appropriate error messages
- Graceful fallback interface
- Loading states

### ✅ Improved User Experience

- Loading spinner while map loads
- Clear error messages for different scenarios
- Fallback shows location coordinates and marker count
- Developer-friendly error messages

### ✅ Enhanced Functionality

- Proper marker cleanup to prevent memory leaks
- Marker animations (drop effect)
- Better info window handling
- Cooperative gesture handling for better mobile experience

### ✅ Component Props

```typescript
interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
  }>;
  className?: string;
  onClick?: (lat: number, lng: number) => void;
  apiKey?: string; // NEW: API key prop
  fallbackMessage?: string; // NEW: Custom fallback message
}
```

## Usage Examples

### Basic Usage (with environment variable)

```tsx
<GoogleMap
  center={{ lat: 37.7749, lng: -122.4194 }}
  zoom={12}
  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
/>
```

### With Custom Fallback Message

```tsx
<GoogleMap
  center={{ lat: 37.7749, lng: -122.4194 }}
  zoom={12}
  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
  fallbackMessage='Unable to load map for this location. Please try again later.'
/>
```

### With Markers

```tsx
<GoogleMap
  center={{ lat: 37.7749, lng: -122.4194 }}
  zoom={12}
  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
  markers={[
    {
      id: '1',
      position: { lat: 37.7749, lng: -122.4194 },
      title: 'San Francisco',
      info: '<div><h3>San Francisco</h3><p>Beautiful city by the bay</p></div>',
    },
  ]}
/>
```

## Current State

- ✅ **Application works without API key** (shows fallback interface)
- ✅ **No crashes or console errors**
- ✅ **User-friendly error messages**
- ✅ **Developer guidance included**
- ✅ **Production-ready error handling**

## Files Updated

1. `src/components/maps/GoogleMap.tsx` - Enhanced with better error handling
2. `src/pages/ListingDetails.tsx` - Added API key prop
3. `src/components/maps/ListingsMap.tsx` - Added API key prop
4. `.env.example` - Template for environment variables

## Security Notes

- Never commit your actual API key to version control
- Use `.env` files for local development
- Set up API key restrictions in Google Cloud Console
- Use environment variables in production deployments
