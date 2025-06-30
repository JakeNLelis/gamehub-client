import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { gameService } from "../services/gameService.js";
import UserProfile from "../components/auth/UserProfile.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import {
  Heart,
  Grid,
  List,
  Search,
  Filter,
  Star,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer.jsx";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [sortBy, setSortBy] = useState("addedAt");
  const itemsPerPage = 12;
  // Fetch user's favorite games
  const fetchFavorites = useCallback(
    async (page = 1, filters = {}) => {
      try {
        setFavoritesLoading(true);
        const params = {
          page,
          limit: itemsPerPage,
          ...filters,
        };

        const response = await gameService.getUserFavorites(params);

        if (response.success) {
          setFavorites(response.data);
          setCurrentPage(response.pagination.currentPage);
          setTotalPages(response.pagination.totalPages);
          setTotalFavorites(response.pagination.totalFavorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      } finally {
        setFavoritesLoading(false);
      }
    },
    [itemsPerPage]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(() => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedGenre) filters.genre = selectedGenre;
    if (selectedPlatform) filters.platform = selectedPlatform;
    if (sortBy) filters.sortBy = sortBy;

    fetchFavorites(1, filters);
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, selectedPlatform, sortBy, fetchFavorites]);
  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedGenre) filters.genre = selectedGenre;
      if (selectedPlatform) filters.platform = selectedPlatform;
      if (sortBy) filters.sortBy = sortBy;

      fetchFavorites(newPage, filters);
    },
    [searchTerm, selectedGenre, selectedPlatform, sortBy, fetchFavorites]
  );
  // Handle favorite removal
  const handleRemoveFromFavorites = useCallback(
    async (gameId) => {
      try {
        await gameService.removeFromFavorites(gameId);
        // Refresh favorites list
        handleFilterChange();
      } catch (error) {
        console.error("Error removing from favorites:", error);
      }
    },
    [handleFilterChange]
  );
  // Initial load
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  // Handle filter changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedGenre, selectedPlatform, sortBy, handleFilterChange]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Please log in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <UserProfile />
        </div>

        {/* Favorites Section */}
        <div>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-white">My Favorites</h2>
              <span className="bg-slate-700 text-white px-3 py-1 rounded-full text-sm">
                {totalFavorites}
              </span>
            </div>
          </div>
          <div>
            {/* Favorites Controls */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search favorites..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Genre Filter */}
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Genres</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="RPG">RPG</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Simulation">Simulation</option>
                    <option value="Sports">Sports</option>
                    <option value="Racing">Racing</option>
                    <option value="Puzzle">Puzzle</option>
                  </select>

                  {/* Platform Filter */}
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Platforms</option>
                    <option value="PC">PC</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Nintendo">Nintendo</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>

                {/* Sort and View Controls */}
                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="addedAt">Recently Added</option>
                    <option value="title">Title</option>
                    <option value="rating">Rating</option>
                    <option value="release-date">Release Date</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex bg-slate-700 rounded-lg">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-l-lg ${
                        viewMode === "grid"
                          ? "bg-blue-600 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-r-lg ${
                        viewMode === "list"
                          ? "bg-blue-600 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Content */}
            {favoritesLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : favorites.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-12 text-center">
                <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Favorites Yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Start adding games to your favorites to see them here!
                </p>
                <Link
                  to="/search"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Browse Games
                </Link>
              </div>
            ) : (
              <>
                {/* Games Grid/List */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((favorite) => (
                      <GameCard
                        key={favorite._id}
                        favorite={favorite}
                        onRemove={handleRemoveFromFavorites}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favorites.map((favorite) => (
                      <GameListItem
                        key={favorite._id}
                        favorite={favorite}
                        onRemove={handleRemoveFromFavorites}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                      >
                        Previous
                      </button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + Math.max(1, currentPage - 2);
                          if (page > totalPages) return null;

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 rounded-lg transition-colors ${
                                page === currentPage
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-700 text-white hover:bg-slate-600"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Game Card Component for Grid View
const GameCard = ({ favorite, onRemove }) => {
  const game = favorite.gameId;

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all group">
      <div className="relative">
        <Link to={`/game/${game._id}`}>
          <img
            src={game.thumbnail || "/placeholder-game.jpg"}
            alt={game.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </Link>
        <button
          onClick={() => onRemove(game._id)}
          className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove from favorites"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>
      </div>

      <div className="p-4">
        <Link to={`/game/${game._id}`}>
          <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
            {game.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span className="px-2 py-1 bg-slate-700 rounded text-xs">
            {game.genre}
          </span>
          {game.averageRating && (
            <div className="flex items-center">
              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
              <span>{game.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Added {new Date(favorite.addedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

// Game List Item Component for List View
const GameListItem = ({ favorite, onRemove }) => {
  const game = favorite.gameId;

  return (
    <div className="bg-slate-800 rounded-lg p-4 hover:ring-2 hover:ring-blue-500 transition-all">
      <div className="flex items-center space-x-4">
        <Link to={`/game/${game._id}`} className="flex-shrink-0">
          <img
            src={game.thumbnail || "/placeholder-game.jpg"}
            alt={game.title}
            className="w-16 h-16 object-cover rounded"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/game/${game._id}`}>
            <h3 className="font-semibold text-white hover:text-blue-400 transition-colors truncate">
              {game.title}
            </h3>
          </Link>

          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
            <span className="px-2 py-1 bg-slate-700 rounded text-xs">
              {game.genre}
            </span>
            <span>{game.platform}</span>
            {game.averageRating && (
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                <span>{game.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-xs text-gray-500">
            Added {new Date(favorite.addedAt).toLocaleDateString()}
          </div>
          <button
            onClick={() => onRemove(game._id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
            title="Remove from favorites"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
