# 🏡 The Glen - Vacation Rental Platform

A modern, full-stack vacation rental platform built with React and Node.js, similar to Airbnb. The Glen allows users to discover, book, and manage vacation rental properties with a beautiful, responsive interface.

## 🌟 Features

### For Guests

- 🔍 **Property Search & Discovery** - Advanced search with filters (location, price, amenities, dates)
- 🗺️ **Interactive Maps** - Google Maps integration with property locations
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ⭐ **Reviews & Ratings** - Read and write property reviews
- 💳 **Secure Payments** - Stripe integration for safe transactions
- 📅 **Booking Management** - View and manage your bookings
- 👤 **User Profiles** - Manage personal information and preferences

### For Hosts

- 🏠 **Property Listing** - Create and manage property listings
- 📊 **Host Dashboard** - Track bookings, earnings, and property performance
- 📸 **Image Management** - Upload and manage property photos
- 💰 **Pricing Control** - Set dynamic pricing and availability
- 📈 **Analytics** - View booking statistics and revenue

### General Features

- 🔐 **Authentication & Authorization** - Secure user registration and login
- 🌐 **Multi-currency Support** - Display prices in different currencies
- ♿ **Accessibility** - WCAG compliant design
- 🎨 **Modern UI/UX** - Clean, professional interface

## 🛠️ Technologies Used

### Frontend (Client)

- **React 19.1.0** - Modern UI library with latest features
- **TypeScript 4.9.5** - Type-safe JavaScript development
- **React Router DOM 7.6.2** - Client-side routing
- **CSS3** - Modern styling with flexbox, grid, and animations
- **Lucide React 0.515.0** - Beautiful, customizable icons
- **Axios 1.10.0** - HTTP client for API communication
- **Date-fns 4.1.0** - Modern date manipulation library

### Backend (Server)

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing and security

### External Services

- **Google Maps API** - Interactive maps and geolocation
- **Stripe API** - Payment processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Google Maps API key
- Stripe API keys

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "The Glen"
   ```

2. **Install client dependencies**

   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**

   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**

   **Client (.env)**

   ```bash
   cd ../client
   cp .env.example .env
   ```

   Edit `.env` and add:

   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   REACT_APP_API_URL=http://localhost:5000/api
   ```

   **Server (.env)**

   ```bash
   cd ../server
   touch .env
   ```

   Add to server `.env`:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/the-glen
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

### 🏃‍♂️ Running the Application

1. **Start the backend server**

   ```bash
   cd server
   npm start
   ```

   Server runs on: `http://localhost:5000`

2. **Start the frontend client**

   ```bash
   cd client
   npm start
   ```

   Client runs on: `http://localhost:3000`

3. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
The Glen/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── booking/   # Booking-related components
│   │   │   ├── listing/   # Property listing components
│   │   │   ├── maps/      # Google Maps components
│   │   │   └── ...
│   │   ├── pages/         # Main application pages
│   │   ├── contexts/      # React context providers
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Express middleware
│   │   └── server.js      # Main server file
│   └── package.json
└── README.md
```

## 🎯 Usage Guide

### For Development

1. **Adding new components**

   ```bash
   cd client/src/components
   mkdir new-component
   touch new-component/NewComponent.tsx
   touch new-component/NewComponent.css
   ```

2. **Building for production**

   ```bash
   cd client
   npm run build
   ```

3. **Running tests**
   ```bash
   npm test
   ```

### API Endpoints

The backend provides RESTful APIs:

- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create new listing
- `GET /api/listings/:id` - Get specific listing
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## 🔧 Configuration

### Payment Setup

1. Create Stripe account
2. Get API keys from Stripe dashboard
3. Add keys to environment variables
4. Configure webhook endpoints

## 🎨 Component Library

### Key Components

- **ListingCard** - Professional property display cards
- **GoogleMap** - Interactive map with fallback support
- **SearchBar** - Advanced property search
- **BookingModal** - Secure booking interface
- **PaymentForm** - Stripe-integrated payment processing

## 📱 Responsive Design

The application is fully responsive and optimized for:

- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large screens** (1440px+)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Environment variable protection
- Secure payment processing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request
