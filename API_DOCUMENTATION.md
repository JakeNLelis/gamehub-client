# GameHub API Documentation

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#user-endpoints)
  - [Games](#game-endpoints)
  - [Reviews](#review-endpoints)
  - [Favorites](#favorite-endpoints)
- [Testing](#testing)
- [Performance](#performance)

## Overview

The GameHub API is a RESTful API built with Node.js and Express that provides endpoints for managing games, user authentication, reviews, and favorites.

**Base URL:** `http://localhost:5000/api`
**Version:** 1.0.0
**Authentication:** JWT Bearer tokens

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Users authenticate via Google OAuth 2.0, and the API returns a JWT token that must be included in subsequent requests.

### Authorization Header

```
Authorization: Bearer <jwt_token>
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {}, // or [] for arrays
  "message": "Optional success message",
  "pagination": {
    // For paginated endpoints
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

- **Global Rate Limit:** 100 requests per 15 minutes per IP
- **User Rate Limit:** 100 requests per 15 minutes per authenticated user
- **Authentication Endpoints:** 20 requests per 15 minutes per IP

Rate limit headers are included in responses:

- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time

## Endpoints

### Authentication Endpoints

#### GET /auth/google

Initiates Google OAuth authentication flow.

**Response:** Redirects to Google OAuth consent screen

#### GET /auth/google/callback

Google OAuth callback endpoint.

**Response:** Redirects to frontend with JWT token

#### POST /auth/refresh

Refreshes an expired JWT token.

**Request Body:**

```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "expiresIn": "7d"
  }
}
```

#### POST /auth/logout

**Authentication:** Required

Logs out the current user.

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me

**Authentication:** Required

Gets current user profile.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "googleId": "google_id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "avatar_filename.jpg",
    "avatarUrl": "http://localhost:5000/uploads/avatars/avatar_filename.jpg",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### GET /auth/profile

**Authentication:** Required

Gets current user profile (alias for /auth/me).

**Response:** Same as GET /auth/me

#### DELETE /auth/delete-account

**Authentication:** Required

Permanently deletes user account and all associated data.

**Response:**

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### User Endpoints

#### GET /users/profile

**Authentication:** Required

Gets user profile (same as /auth/me).

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "avatar_filename.jpg",
    "avatarUrl": "http://localhost:5000/uploads/avatars/avatar_filename.jpg",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### PUT /users/profile

**Authentication:** Required

Updates user profile.

**Request Body:**

```json
{
  "name": "New Name"
}
```

**Validation:**

- `name`: Required, 2-50 characters

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "name": "New Name",
    "email": "user@example.com",
    "avatar": "avatar_filename.jpg",
    "avatarUrl": "http://localhost:5000/uploads/avatars/avatar_filename.jpg",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### POST /users/avatar

**Authentication:** Required
**Content-Type:** multipart/form-data

Uploads user avatar image.

**Request:** Form data with `avatar` file field
**File Requirements:**

- Max size: 5MB
- Allowed types: jpg, jpeg, png, gif

**Response:**

```json
{
  "success": true,
  "data": {
    "avatar": "avatar_filename.jpg",
    "avatarUrl": "http://localhost:5000/uploads/avatars/avatar_filename.jpg"
  },
  "message": "Avatar uploaded successfully"
}
```

#### DELETE /users/avatar

**Authentication:** Required

Deletes user avatar.

**Response:**

```json
{
  "success": true,
  "message": "Avatar deleted successfully"
}
```

#### DELETE /users/account

**Authentication:** Required

Permanently deletes user account and all associated data.

**Response:**

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### Game Endpoints

#### GET /games

Gets paginated list of games with filtering and sorting.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `category` (string): Filter by genre
- `platform` (string): Filter by platform
- `search` (string): Search in title and description
- `sort-by` (string): Sort by (release-date, alphabetical, rating, relevance)
- `tag` (string): Filter by tags (dot-separated)

**Example:** `/games?category=MMORPG&platform=PC&sort-by=rating&page=1&limit=10`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "game_id",
      "externalId": 123,
      "title": "Game Title",
      "shortDescription": "Game description",
      "genre": "MMORPG",
      "platform": "PC (Windows)",
      "thumbnail": "https://example.com/image.jpg",
      "gameUrl": "https://example.com/game",
      "averageRating": 4.5,
      "totalReviews": 150,
      "releaseDate": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalGames": 100,
    "gamesPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### GET /games/:id

Gets specific game details.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "game_id",
    "title": "Game Title"
    // ... other game fields
  }
}
```

#### GET /games/filters/metadata

Gets available filter options.

**Response:**

```json
{
  "success": true,
  "data": {
    "categories": [
      { "name": "mmorpg", "displayName": "MMORPG" },
      { "name": "strategy", "displayName": "Strategy" }
    ],
    "platforms": [
      { "name": "PC (Windows)", "displayName": "PC (Windows)" },
      { "name": "Web Browser", "displayName": "Web Browser" }
    ],
    "sortOptions": [
      { "value": "relevance", "label": "Most Relevant" },
      { "value": "rating", "label": "Highest Rated" }
    ]
  }
}
```

#### GET /games/stats

Gets game statistics and summary information.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalGames": 500,
    "totalReviews": 1250,
    "averageRating": 4.2,
    "topGenres": [
      { "genre": "MMORPG", "count": 45 },
      { "genre": "Strategy", "count": 38 }
    ],
    "topPlatforms": [
      { "platform": "PC (Windows)", "count": 350 },
      { "platform": "Web Browser", "count": 150 }
    ]
  }
}
```

#### GET /games/search/advanced

Advanced search with multiple filters.

**Query Parameters:**

- `query` (string): Text search in title, description, developer, publisher
- `genres` (string): Comma-separated list of genres
- `platforms` (string): Comma-separated list of platforms
- `minRating` (number): Minimum average rating
- `maxRating` (number): Maximum average rating
- `sortBy` (string): Sort by (rating-desc, rating-asc, release-date-desc, release-date-asc, title-asc, title-desc)
- `page` (number): Page number
- `limit` (number): Items per page

**Response:** Same format as GET /games

#### POST /games/sync

Manually trigger game synchronization from external API.

**Authentication:** Public (should be protected in production)

**Response:**

```json
{
  "success": true,
  "message": "Game synchronization started",
  "data": {
    "syncId": "sync_12345",
    "estimatedTime": "5-10 minutes"
  }
}
```

### Review Endpoints

#### GET /reviews/:gameId

Gets reviews for a specific game.

**Authentication:** Optional (user's review appears first if authenticated)

**Query Parameters:**

- `page` (number): Page number
- `limit` (number): Items per page

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "review_id",
      "userId": {
        "_id": "user_id",
        "name": "User Name",
        "avatar": "avatar.jpg"
      },
      "gameId": "game_id",
      "rating": 5,
      "title": "Great game!",
      "content": "This is an amazing game...",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /reviews/:gameId

**Authentication:** Required

Creates or updates a user's review for a specific game.

**Request Body:**

```json
{
  "rating": 5,
  "content": "Review content"
}
```

**Validation:**

- `rating`: Required, integer 1-5
- `content`: Required, 1-1000 characters

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "review_id",
    "userId": "user_id",
    "gameId": "game_id",
    "rating": 5,
    "content": "Review content",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Review created successfully"
}
```

#### PUT /reviews/:reviewId

**Authentication:** Required

Updates user's own review.

**Request Body:** Same as POST /reviews/:gameId

**Response:** Same as POST /reviews/:gameId

#### DELETE /reviews/:reviewId

**Authentication:** Required

Deletes user's own review.

**Response:**

```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

#### GET /reviews/user/reviews

**Authentication:** Required

Gets all reviews by the authenticated user.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "review_id",
      "userId": "user_id",
      "gameId": {
        "_id": "game_id",
        "title": "Game Title",
        "thumbnail": "https://example.com/image.jpg",
        "genre": "Action",
        "platform": "PC (Windows)"
      },
      "rating": 5,
      "content": "Amazing gameplay",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalReviews": 45,
    "reviewsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Favorite Endpoints

#### GET /favorites

**Authentication:** Required

Gets user's favorite games.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `genre` (string): Filter by genre
- `platform` (string): Filter by platform

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "favorite_id",
      "userId": "user_id",
      "gameId": {
        "_id": "game_id",
        "title": "Game Title",
        "thumbnail": "https://example.com/image.jpg",
        "genre": "Action",
        "platform": "PC (Windows)",
        "averageRating": 4.5,
        "totalReviews": 150
      },
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalFavorites": 25,
    "favoritesPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### GET /favorites/filtered

**Authentication:** Required

Gets user's favorite games with advanced filtering options.

**Query Parameters:**

- `genre` (string): Filter by genre
- `platform` (string): Filter by platform
- `sortBy` (string): Sort by (title, date-added, rating)
- `order` (string): Sort order (asc, desc)
- `page` (number): Page number
- `limit` (number): Items per page

**Response:** Same format as GET /favorites

#### POST /favorites/:gameId

**Authentication:** Required

Adds game to user's favorites.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "favorite_id",
    "userId": "user_id",
    "gameId": "game_id",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Game added to favorites"
}
```

#### DELETE /favorites/:gameId

**Authentication:** Required

Removes game from user's favorites.

**Response:**

```json
{
  "success": true,
  "message": "Game removed from favorites"
}
```

#### GET /favorites/check/:gameId

**Authentication:** Required

Checks if a game is in user's favorites.

**Response:**

```json
{
  "success": true,
  "data": {
    "isFavorite": true
  }
}
```

## Testing

The API includes comprehensive test coverage using Jest and Supertest.

### Running Tests

```bash
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Test Structure

- **Unit Tests:** Individual function and service testing
- **Integration Tests:** Full endpoint testing with database
- **Authentication Tests:** JWT and OAuth flow testing
- **Error Handling Tests:** Various error scenarios

## Performance

### Optimization Features

- **Database Indexing:** Optimized queries with proper indexes
- **Pagination:** All list endpoints support pagination
- **Response Compression:** Gzip compression for JSON responses
- **Caching:** Strategic caching for frequently accessed data
- **Rate Limiting:** Prevents abuse and ensures fair usage
- **Request Logging:** Performance monitoring and slow query detection

### Monitoring Endpoints

#### GET /health

System health check endpoint.

**Response:**

```json
{
  "status": "OK",
  "message": "GameHub API is running",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### Performance Headers

- `X-Response-Time`: Request processing time in milliseconds
- `X-RateLimit-*`: Rate limiting information

## Development

### Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gamehub
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FREETOGAME_API_URL=https://www.freetogame.com/api/games
```

### Local Development

```bash
npm install
npm run dev
```

### Production Deployment

```bash
npm start
```
