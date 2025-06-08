# GameHub Frontend - Authentication System

This is the frontend application for GameHub, built with React and featuring a complete authentication system based on the API documentation.

## Features Implemented

### 🔐 Authentication System

- **Google OAuth 2.0 Integration** - Secure login via Google
- **JWT Token Management** - Automatic token handling with refresh capabilities
- **Protected Routes** - Routes that require authentication
- **Session Management** - Persistent login sessions with automatic refresh

### 👤 User Management

- **User Profile View** - Display user information and avatar
- **Profile Editing** - Update user name and information
- **Avatar Upload** - Profile picture upload with validation
- **Avatar Management** - Delete and update profile pictures
- **Account Deletion** - Complete account removal with confirmation

### 🛡️ Security Features

- **Automatic Token Refresh** - Seamless token renewal
- **Error Handling** - Comprehensive error boundaries and handling
- **Input Validation** - Client-side form validation
- **Rate Limiting Aware** - Handles API rate limits gracefully

### 🎨 UI/UX Features

- **Responsive Design** - Mobile-friendly Tailwind CSS styling
- **Loading States** - Proper loading indicators for all actions
- **Error Feedback** - Clear error messages and success notifications
- **Modern Design** - Beautiful gradient backgrounds and clean interfaces

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Clone and navigate to the project**

   ```bash
   cd c:\Users\bayut\OneDrive\Documents\PersonalProjects\my_gamehub\client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - Copy `.env.example` to `.env`
   - Update the Google Client ID if needed

   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_ENV=development
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Authentication Flow

### Login Process

1. User clicks "Continue with Google" on the login page
2. Redirected to Google OAuth consent screen
3. After approval, redirected back to `/auth/callback` with tokens
4. Tokens are stored in cookies and user is redirected to homepage
5. Authentication state is managed globally via React Context

### Protected Routes

- All routes except `/login` and `/auth/callback` require authentication
- Unauthenticated users are automatically redirected to login
- Authentication state persists across browser sessions

### Token Management

- JWT tokens are automatically included in API requests
- Expired tokens trigger automatic refresh attempts
- Failed refresh redirects to login page
- Tokens are stored in secure HTTP-only cookies (when possible)

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx              # Google OAuth login page
│   │   ├── ProtectedRoute.jsx     # Route protection wrapper
│   │   └── UserProfile.jsx        # User profile management
│   └── common/
│       ├── ErrorBoundary.jsx      # Error boundary component
│       └── LoadingSpinner.jsx     # Loading state component
├── context/
│   └── AuthContext.jsx            # Authentication context provider
├── hooks/
│   └── useAuth.js                 # Authentication-related hooks
├── pages/
│   ├── Homepage.jsx               # Main homepage (FreeToGame-inspired design)
│   └── OAuthCallback.jsx          # OAuth callback handler
├── services/
│   ├── api.js                     # Axios instance with interceptors
│   └── authService.js             # Authentication API calls
├── utils/
│   └── auth.js                    # Authentication utility functions
└── config/
    └── index.js                   # Configuration management
```

## API Integration

The frontend integrates with all authentication endpoints from the API documentation:

### Implemented Endpoints

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `DELETE /auth/delete-account` - Delete user account
- `PUT /users/profile` - Update user profile
- `POST /users/avatar` - Upload user avatar
- `DELETE /users/avatar` - Delete user avatar

### Request/Response Handling

- Automatic JWT token attachment to requests
- Consistent error handling across all API calls
- Loading states for all async operations
- Proper HTTP status code handling

## Next Steps

The authentication system is complete and ready for use. Future enhancements could include:

1. **Games Module** - Browse and search games
2. **Reviews Module** - Create and manage game reviews
3. **Favorites Module** - Save and organize favorite games
4. **Advanced Features** - Social features, notifications, etc.

## Troubleshooting

### Common Issues

1. **"Network Error" on login**

   - Ensure the backend API is running on `http://localhost:5000`
   - Check that Google OAuth is properly configured

2. **Styling issues**

   - Ensure Tailwind CSS is properly installed and configured
   - Check that the Tailwind config matches your needs

3. **Authentication not persisting**
   - Check browser developer tools for cookie storage
   - Verify JWT tokens are being stored correctly

### Development Tools

- **React Developer Tools** - For debugging React components
- **Browser DevTools** - For network requests and cookie inspection
- **VS Code Extensions** - ES7+ React/Redux/React-Native snippets

## Contributing

When adding new features:

1. Follow the existing code structure and patterns
2. Add proper error handling and loading states
3. Include responsive design considerations
4. Update this README with new features
