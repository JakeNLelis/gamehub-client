import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import {
  useGames,
  useFavoriteActions,
  useGameStats,
} from "../hooks/useGames.js";
import { Search, Play, Users, MessageSquare, ArrowLeft } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import GameCard from "../components/common/GameCard.jsx";
import Footer from "../components/layout/Footer.jsx";

const Homepage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchPagination, setSearchPagination] = useState(null);

  // Listen for search results from Header component
  useEffect(() => {
    const handleSearchResults = (event) => {
      const { results, pagination } = event.detail;
      setSearchResults(results);
      setSearchPagination(pagination);
    };

    const handleClearResults = () => {
      setSearchResults(null);
      setSearchPagination(null);
    };

    // Check for stored search results on component mount
    const storedResults = sessionStorage.getItem("searchResults");
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        // Only use results if they're less than 5 minutes old
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          setSearchResults(parsed.results);
          setSearchPagination(parsed.pagination);
        } else {
          sessionStorage.removeItem("searchResults");
        }
      } catch (error) {
        console.error("Error parsing stored search results:", error);
        sessionStorage.removeItem("searchResults");
      }
    }

    window.addEventListener("searchResults", handleSearchResults);
    window.addEventListener("clearSearchResults", handleClearResults);

    return () => {
      window.removeEventListener("searchResults", handleSearchResults);
      window.removeEventListener("clearSearchResults", handleClearResults);
    };
  }, []);

  // Fetch different sets of games for different sections
  const { games: trendingGames, loading: trendingLoading } = useGames({
    limit: 6,
    "sort-by": "rating",
  });

  const { games: newReleases, loading: newLoading } = useGames({
    limit: 5,
    "sort-by": "release-date",
  });

  const { games: allGames, loading: allLoading } = useGames({
    limit: 20,
  });

  // Fetch platform statistics
  const { stats, loading: statsLoading } = useGameStats();

  const { addToFavorites } = useFavoriteActions();
  // Handle favorite toggle
  const handleFavoriteToggle = async (gameId) => {
    try {
      await addToFavorites(gameId);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search page with search query
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Clear search results
  const clearSearchResults = () => {
    setSearchResults(null);
    setSearchPagination(null);
    sessionStorage.removeItem("searchResults");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Search Results Section */}
      {searchResults && (
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={clearSearchResults}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Homepage</span>
                </button>
                <div className="h-6 w-px bg-slate-600"></div>
                <h2 className="text-2xl font-bold">
                  Search Results ({searchResults.length} games found)
                </h2>
              </div>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {" "}
                {searchResults.map((game) => (
                  <GameCard
                    key={game._id || game.id}
                    game={game}
                    size="large"
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl">No games found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </div>
            )}

            {/* Pagination info */}
            {searchPagination && searchResults.length > 0 && (
              <div className="mt-8 text-center text-gray-400 text-sm">
                Showing page {searchPagination.currentPage} of{" "}
                {searchPagination.totalPages}({searchPagination.totalGames}{" "}
                total games)
              </div>
            )}
          </div>
        </div>
      )}{" "}
      {/* Hero Section - Hidden when showing search results */}
      {!searchResults && (
        <>
          <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 py-20">
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative container mx-auto px-6">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
                  Welcome to GameHub
                </h1>
                <p className="text-xl mb-8 text-gray-300">
                  Discover, review, and favorite your next gaming adventure
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-md mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for games..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <main className="container mx-auto px-6 py-12">
            {/* Trending Games Section */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Trending Games</h2>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  View All
                </button>
              </div>

              {trendingLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {" "}
                  {trendingGames.map((game) => (
                    <GameCard
                      key={game._id || game.id}
                      game={game}
                      size="large"
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
                </div>
              )}
            </section>{" "}
            {/* Stats Section */}
            <section className="bg-slate-800 rounded-lg p-8 mb-16">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Platform Statistics
              </h2>
              {statsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Games Available
                    </h3>
                    <p className="text-3xl font-bold text-blue-400">
                      {stats?.totalGames
                        ? `${stats.totalGames.toLocaleString()}+`
                        : `${allGames.length}+`}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Active Players
                    </h3>
                    <p className="text-3xl font-bold text-green-400">
                      {stats?.totalUsers
                        ? `${stats.totalUsers.toLocaleString()}+`
                        : "10K+"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Reviews Written
                    </h3>
                    <p className="text-3xl font-bold text-purple-400">
                      {stats?.totalReviews
                        ? `${stats.totalReviews.toLocaleString()}+`
                        : "5K+"}
                    </p>
                  </div>
                </div>
              )}
            </section>
            {/* New Releases Section */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">New Releases</h2>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  View All
                </button>
              </div>

              {newLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-4">
                  {" "}
                  {newReleases.map((game) => (
                    <GameCard
                      key={game._id || game.id}
                      game={game}
                      size="small"
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
                </div>
              )}
            </section>
            {/* Call to Action Section */}
            {!user && (
              <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">
                  Join the GameHub Community
                </h2>
                <p className="text-lg mb-6 text-gray-200">
                  Sign up to create your own game reviews, build your favorites
                  list, and connect with other gamers
                </p>
                <div className="space-x-4">
                  <a
                    href="/register"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
                  >
                    Sign Up
                  </a>
                  <a
                    href="/login"
                    className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
                  >
                    Log In
                  </a>
                </div>
              </section>
            )}
            {/* All Games Preview */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">All Games</h2>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  Browse All Games
                </button>
              </div>
              {allLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {" "}
                  {allGames.slice(0, 8).map((game) => (
                    <GameCard
                      key={game._id || game.id}
                      game={game}
                      size="large"
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
                </div>
              )}{" "}
            </section>
          </main>
        </>
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
