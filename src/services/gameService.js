import axios from "axios";
import { config } from "../config/index.js";
import api from "./api.js";

// Create a public axios instance (no auth required)
const publicApi = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Game service functions
export const gameService = {
  // Get all games (public endpoint)
  getGames: async (params = {}) => {
    try {
      const response = await publicApi.get("/games", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error;
    }
  },

  // Search games with basic search query (public endpoint)
  searchGames: async (searchQuery, params = {}) => {
    try {
      const searchParams = {
        search: searchQuery,
        ...params,
      };
      const response = await publicApi.get("/games", { params: searchParams });
      return response.data;
    } catch (error) {
      console.error("Error searching games:", error);
      throw error;
    }
  },

  // Advanced search with multiple filters (public endpoint)
  advancedSearchGames: async (filters = {}) => {
    try {
      const response = await publicApi.get("/games/search/advanced", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error performing advanced search:", error);
      throw error;
    }
  },

  // Get game by ID (public endpoint)
  getGameById: async (id) => {
    try {
      const response = await publicApi.get(`/games/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching game by ID:", error);
      throw error;
    }
  },

  // Get game statistics (public endpoint)
  getGameStats: async () => {
    try {
      const response = await publicApi.get("/games/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching game stats:", error);
      throw error;
    }
  },

  // Get filter metadata (public endpoint)
  getFilterMetadata: async () => {
    try {
      const response = await publicApi.get("/games/filters/metadata");
      return response.data;
    } catch (error) {
      console.error("Error fetching filter metadata:", error);
      throw error;
    }
  },

  // Add to favorites (requires authentication)
  addToFavorites: async (gameId) => {
    try {
      const response = await api.post(`/favorites/${gameId}`);
      return response.data;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  },

  // Remove from favorites (requires authentication)
  removeFromFavorites: async (gameId) => {
    try {
      const response = await api.delete(`/favorites/${gameId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    }
  },

  // Check if game is favorite (requires authentication)
  checkFavorite: async (gameId) => {
    try {
      const response = await api.get(`/favorites/check/${gameId}`);
      return response.data;
    } catch (error) {
      console.error("Error checking favorite:", error);
      throw error;
    }
  },

  // Get user's favorite games (requires authentication)
  getUserFavorites: async (params = {}) => {
    try {
      const response = await api.get("/favorites", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      throw error;
    }
  },

  // Get filtered user favorites (requires authentication)
  getFilteredFavorites: async (params = {}) => {
    try {
      const response = await api.get("/favorites/filtered", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered favorites:", error);
      throw error;
    }
  },

  // Get reviews for a game (public endpoint)
  getGameReviews: async (gameId, params = {}) => {
    try {
      const response = await publicApi.get(`/reviews/${gameId}`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching game reviews:", error);
      throw error;
    }
  },

  // Create or update review (requires authentication)
  createOrUpdateReview: async (gameId, reviewData) => {
    try {
      const response = await api.post(`/reviews/${gameId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error creating/updating review:", error);
      throw error;
    }
  },

  // Delete review (requires authentication)
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },
};

export default gameService;
