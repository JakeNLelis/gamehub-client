# 🎮 GameHub

A comprehensive full-stack web application for discovering and managing free-to-play games. GameHub allows users to browse, search, favorite, and review games from a curated collection of free-to-play titles.

## ✨ Features

- **🔍 Game Discovery**: Browse and search through hundreds of free-to-play games
- **🔐 Google OAuth Authentication**: Secure sign-in with Google accounts
- **⭐ Favorites Management**: Add games to your personal favorites list
- **📝 Game Reviews**: Write, edit, and manage reviews for games
- **👤 User Profiles**: Personalized user profiles with avatar uploads
- **📱 Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **🔒 Protected Routes**: Secure user areas with authentication middleware
- **🚀 Performance Optimized**: React Query for efficient data fetching and caching

## 🛠️ Tech Stack

### Frontend (Client)

- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Query (@tanstack/react-query)** - Server state management
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons
- **ESLint** - Code linting and formatting

### Backend (Server)

- **Node.js & Express** - Server runtime and web framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT & Passport.js** - Authentication and authorization
- **Google OAuth 2.0** - Social authentication
- **Helmet** - Security middleware
- **Multer** - File upload handling
- **Jest** - Testing framework

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- Google OAuth credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my_gamehub
   ```

2. **Install dependencies**

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Configuration**

   Create `.env` files in both client and server directories:

   **Server (.env):**

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLIENT_URL=http://localhost:3000
   ```

   **Client (.env):**

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the Development Servers**

   ```bash
   # Terminal 1 - Start the backend server
   cd server
   npm run dev

   # Terminal 2 - Start the frontend client
   cd client
   npm run dev
   ```

5. **Initialize Game Database (Optional)**
   ```bash
   cd server
   npm run sync-games
   ```

## 📁 Project Structure

```
my_gamehub/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   ├── services/      # API service functions
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── server/                # Node.js backend API
    ├── src/
    │   ├── controllers/   # Route handlers
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   ├── middleware/    # Custom middleware
    │   ├── services/      # Business logic
    │   └── config/        # Configuration files
    ├── scripts/           # Utility scripts
    └── tests/             # Test files
```

## 🔧 Available Scripts

### Client

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run sync-games` - Fetch and sync games from external API

## 🎯 Key Features Explained

### Authentication System

- Secure Google OAuth 2.0 integration
- JWT access and refresh token system
- Protected routes and user session management

### Game Management

- Integration with FreeToGame API for game data
- Advanced search and filtering capabilities
- Favorites system for bookmarking games
- User reviews and ratings system

### User Experience

- Responsive design that works on all devices
- Loading states and error handling
- Optimistic updates for better UX
- Image optimization and lazy loading

## 📚 API Documentation

Detailed API documentation is available in:

- `client/API_DOCUMENTATION.md` - Frontend API integration guide
- `server/API_DOCUMENTATION.md` - Backend API reference

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
cd server
npm test
```

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization
- Secure file upload handling
- JWT token security

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the client: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables

### Backend (Railway/Heroku)

1. Configure production environment variables
2. Deploy the server directory
3. Ensure MongoDB connection is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.
