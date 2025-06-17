# Professional ListingCard Component

## Overview

The ListingCard component has been completely redesigned and enhanced to be more professional and production-ready.

## Key Improvements

### 🎨 Design & UI/UX

- **Modern Design**: Clean, professional appearance with subtle shadows and smooth transitions
- **Better Typography**: Improved font weights, sizes, and hierarchy
- **Enhanced Visual Feedback**: Smooth hover effects and loading states
- **Professional Color Scheme**: Updated to use modern color palette with better contrast
- **Image Loading States**: Skeleton loading animation while images load
- **Error Handling**: Graceful fallback for broken images

### 🚀 Performance

- **React.memo**: Component is memoized to prevent unnecessary re-renders
- **Lazy Loading**: Images are loaded lazily by default (with priority option for above-the-fold cards)
- **Optimized Animations**: Reduced motion support for accessibility
- **Efficient Re-renders**: Smart state management to minimize performance impact

### ♿ Accessibility

- **ARIA Labels**: Comprehensive accessibility labels for screen readers
- **Semantic HTML**: Proper use of article, headings, and list elements
- **Keyboard Navigation**: Full keyboard support for interactive elements
- **High Contrast Support**: Styles adapt to high contrast mode preferences
- **Focus Management**: Clear focus indicators for keyboard users

### 📱 Responsive Design

- **Mobile-First**: Designed with mobile devices as the primary target
- **Flexible Layout**: Adapts beautifully to different screen sizes
- **Touch-Friendly**: Appropriately sized touch targets for mobile devices
- **Print Support**: Optimized styles for printing

### 🌙 Modern Features

- **Dark Mode**: Automatic adaptation to user's color scheme preference
- **New Listing Badge**: Highlights recent listings (within 30 days)
- **Superhost Badge**: Special badge for highly-rated hosts
- **Favorite Functionality**: Heart icon to add/remove from favorites
- **Share Functionality**: Native share support with clipboard fallback
- **Rating Display**: Enhanced rating display with review count

## New Props

```typescript
interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle?: (listingId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
  showShareButton?: boolean;
  priority?: boolean; // For image loading priority
}
```

## Usage Examples

### Basic Usage

```jsx
<ListingCard listing={listingData} />
```

### With Favorite Functionality

```jsx
<ListingCard
  listing={listingData}
  isFavorite={userFavorites.includes(listingData._id)}
  onFavoriteToggle={handleFavoriteToggle}
/>
```

### Priority Loading (for above-the-fold cards)

```jsx
<ListingCard listing={listingData} priority={true} />
```

### Minimal Version (no action buttons)

```jsx
<ListingCard
  listing={listingData}
  showFavoriteButton={false}
  showShareButton={false}
/>
```

## CSS Features

### Advanced Styling

- **CSS Grid/Flexbox**: Modern layout techniques
- **CSS Custom Properties**: Easy theming and customization
- **Backdrop Filters**: Modern blur effects for badges
- **CSS Transitions**: Smooth animations with easing functions
- **CSS Clamp**: Responsive typography

### Media Queries

- **Responsive Breakpoints**: Optimized for mobile, tablet, and desktop
- **Container Queries**: Future-ready responsive design
- **Print Styles**: Optimized for printing
- **High DPI Support**: Crisp rendering on retina displays

### Accessibility Features

- **Focus Indicators**: Clear visual focus states
- **Reduced Motion**: Respects user preference for reduced motion
- **High Contrast**: Enhanced visibility in high contrast mode
- **Screen Reader**: Hidden decorative elements from screen readers

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement**: Graceful degradation for older browsers
- **CSS Feature Detection**: Uses @supports for modern CSS features

## Performance Metrics

- **Bundle Size**: Optimized for minimal impact on bundle size
- **Runtime Performance**: Efficient rendering and re-rendering
- **Core Web Vitals**: Optimized for good CLS, LCP, and FID scores

## Implementation Notes

- Uses React.memo for performance optimization
- Implements proper error boundaries for image loading
- Supports native web share API with clipboard fallback
- Includes comprehensive TypeScript types
- Follows React best practices and patterns
