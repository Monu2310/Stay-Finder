# The Glen - Server

Backend API for The Glen vacation rental platform, providing comprehensive property management and booking services.

## Overview

The Glen server is a robust Node.js/Express API that powers the vacation rental platform with features including user authentication, property listings management, booking system, and administrative controls.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator
- **CORS**: cors middleware
- **Environment**: dotenv

## Project Structure

```
src/
├── server.js          # Main server entry point
├── seedData.js        # Database seeding script
├── middleware/        # Custom middleware
│   └── auth.js        # Authentication middleware
├── models/           # Mongoose data models
│   ├── User.js       # User model
│   ├── Listing.js    # Property listing model
│   └── Booking.js    # Booking model
└── routes/           # API route handlers
    ├── auth.js       # Authentication routes
    ├── listings.js   # Property management routes
    └── bookings.js   # Booking management routes
```

## Environment Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the server root:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/the-glen
   JWT_SECRET=your-secure-jwt-secret-key
   NODE_ENV=development
   ```

3. **Database Setup**:
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in your `.env` file
   - Run the seed script to populate initial data:
     ```bash
     npm run seed
     ```

## Available Scripts

- **`npm start`**: Run the server in production mode
- **`npm run dev`**: Run the server in development mode with nodemon (auto-restart)
- **`npm run seed`**: Populate the database with sample data

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Listings

- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create new listing (protected)
- `GET /api/listings/:id` - Get specific listing
- `PUT /api/listings/:id` - Update listing (protected)
- `DELETE /api/listings/:id` - Delete listing (protected)

### Bookings

- `GET /api/bookings` - Get user bookings (protected)
- `POST /api/bookings` - Create new booking (protected)
- `PUT /api/bookings/:id` - Update booking (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

## Features

- **User Management**: Registration, login, profile management
- **Property Listings**: CRUD operations for vacation rentals
- **Booking System**: Complete reservation management
- **Authentication**: JWT-based secure authentication
- **File Upload**: Support for property images
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Centralized error management
- **CORS Support**: Cross-origin resource sharing enabled

## Development

1. **Start Development Server**:

   ```bash
   npm run dev
   ```

2. **Server will run on**: `http://localhost:5000`

3. **Database Connection**: Ensure MongoDB is running locally or accessible via your connection string

## Production Deployment

1. Set environment variables for production
2. Use `npm start` to run the server
3. Consider using PM2 or similar process manager
4. Set up proper database hosting (MongoDB Atlas recommended)
5. Configure reverse proxy (nginx) if needed

## Contributing

1. Follow the existing code structure and naming conventions
2. Add proper error handling for new endpoints
3. Include input validation for all user inputs
4. Update this README when adding new features

## License

MIT License - see LICENSE file for details
