# The Glen - Full Stack Vacation Rental Platform

A premium vacation rental platform built with React and Node.js, offering seamless property booking experiences.

## 🏡 Project Overview

The Glen is a comprehensive vacation rental platform that connects property owners with travelers seeking unique accommodations. Built with modern web technologies, it provides a robust, scalable solution for property management and bookings.

## 🏗️ Architecture

This is a full-stack application with:
- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT-based

## 📁 Project Structure

```
├── client/          # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── server/          # Node.js backend API
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Monu2310/Stay-Finder.git
   cd Stay-Finder
   ```

2. **Install dependencies**:
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**:
   ```bash
   # Client environment
   cd client
   cp .env.example .env
   # Add your Google Maps API key to .env
   
   # Server environment
   cd ../server
   cp .env.example .env
   # Configure your MongoDB URI and JWT secret
   ```

4. **Start the applications**:
   ```bash
   # Terminal 1 - Start the server
   cd server
   npm run dev
   
   # Terminal 2 - Start the client
   cd client
   npm start
   ```

5. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Google Maps API** for location services
- **CSS3** with responsive design
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Express Validator** for input validation

## 📖 Documentation

- [Client Documentation](./client/README.md) - Frontend setup and development
- [Server Documentation](./server/README.md) - Backend API and database setup

## 🌟 Features

- **Property Management**: List, edit, and manage vacation rentals
- **User Authentication**: Secure registration and login system
- **Booking System**: Complete reservation management
- **Interactive Maps**: Google Maps integration for property locations
- **Responsive Design**: Mobile-first, cross-device compatibility
- **Search & Filters**: Advanced property search capabilities
- **User Profiles**: Comprehensive user management
- **Reviews & Ratings**: Property review system

## 🚀 Deployment

### Client Deployment
```bash
cd client
npm run build
# Deploy the build/ directory to your hosting service
```

### Server Deployment
```bash
cd server
npm start
# Deploy to your server with proper environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Maps API for location services
- MongoDB for database solutions
- React community for excellent documentation
- All contributors who help improve this project

---

**The Glen** - Where every stay becomes a memorable experience 🏡✨
