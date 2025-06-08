import { useState, useEffect, useMemo } from "react";
import { useAuth } from "./useAuth.js";
import { gameService } from "../services/gameService.js";

export const useGames = (params = {}) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const paramsString = useMemo(() => JSON.stringify(params), [params]);
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        // Parse the params from the memoized string to avoid dependency issues
        const parsedParams = JSON.parse(paramsString);
        const response = await gameService.getGames(parsedParams);

        if (response.success) {
          setGames(response.data);
          setPagination(response.pagination);
        } else {
          setError("Failed to fetch games");
        }
      } catch (err) {
        console.error("Error fetching games:", err);
        setError(err.message || "Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [paramsString]);

  const refetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gameService.getGames(params);

      if (response.success) {
        setGames(response.data);
        setPagination(response.pagination);
      } else {
        setError("Failed to fetch games");
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setError(err.message || "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  return {
    games,
    loading,
    error,
    pagination,
    refetch: refetchGames,
  };
};

export const useGameDetails = (gameId) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await gameService.getGameById(gameId);

        if (response.success) {
          setGame(response.data);
        } else {
          setError("Failed to fetch game details");
        }
      } catch (err) {
        console.error("Error fetching game details:", err);
        setError(err.message || "Failed to fetch game details");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  return { game, loading, error };
};

export const useFavoriteActions = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const addToFavorites = async (gameId) => {
    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const response = await gameService.addToFavorites(gameId);
      return response;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (gameId) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const response = await gameService.removeFromFavorites(gameId);
      return response;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    addToFavorites,
    removeFromFavorites,
    loading,
  };
};

export const useReviewActions = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const createOrUpdateReview = async (gameId, reviewData) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const response = await gameService.createOrUpdateReview(
        gameId,
        reviewData
      );
      return response;
    } catch (error) {
      console.error("Error creating/updating review:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const response = await gameService.deleteReview(reviewId);
      return response;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrUpdateReview,
    deleteReview,
    loading,
  };
};

export const useGameStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await gameService.getGameStats();

        if (response.success) {
          setStats(response.data);
        } else {
          setError("Failed to fetch game statistics");
        }
      } catch (err) {
        console.error("Error fetching game stats:", err);
        setError(err.message || "Failed to fetch game statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export const useGameSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const searchGames = async (searchQuery, params = {}) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setPagination(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await gameService.searchGames(searchQuery, params);

      if (response.success) {
        setSearchResults(response.data);
        setPagination(response.pagination);
      } else {
        setError("Failed to search games");
      }
    } catch (err) {
      console.error("Error searching games:", err);
      setError(err.message || "Failed to search games");
    } finally {
      setLoading(false);
    }
  };

  const advancedSearch = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await gameService.advancedSearchGames(filters);

      if (response.success) {
        setSearchResults(response.data);
        setPagination(response.pagination);
      } else {
        setError("Failed to perform advanced search");
      }
    } catch (err) {
      console.error("Error performing advanced search:", err);
      setError(err.message || "Failed to perform advanced search");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setPagination(null);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    pagination,
    searchGames,
    advancedSearch,
    clearSearch,
  };
};

export const useFilterMetadata = () => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await gameService.getFilterMetadata();

        if (response.success) {
          setMetadata(response.data);
        } else {
          setError("Failed to fetch filter options");
        }
      } catch (err) {
        console.error("Error fetching filter metadata:", err);
        setError(err.message || "Failed to fetch filter options");
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return { metadata, loading, error };
};
