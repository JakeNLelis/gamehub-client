import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGames, useFavoriteActions } from "../hooks/useGames.js";
import GameCard from "../components/common/GameCard.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import Footer from "../components/layout/Footer.jsx";
import { TrendingUp, Calendar, Star, Clock } from "lucide-react";

const TrendingAndNewPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("trending");

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "new") {
      setActiveTab("new");
    } else {
      setActiveTab("trending");
    }
  }, [searchParams]);

  // Fetch trending games (sorted by rating)
  const { games: trendingGames, loading: trendingLoading } = useGames({
    limit: 24,
    "sort-by": "rating",
  });

  // Fetch new releases (sorted by release date)
  const { games: newReleases, loading: newLoading } = useGames({
    limit: 24,
    "sort-by": "release-date",
  });

  const { addToFavorites } = useFavoriteActions();

  // Handle favorite toggle
  const handleFavoriteToggle = async (gameId) => {
    try {
      await addToFavorites(gameId);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const tabs = [
    {
      id: "trending",
      name: "Trending Games",
      icon: TrendingUp,
      description: "Most popular games right now",
      count: trendingGames.length,
    },
    {
      id: "new",
      name: "New Releases",
      icon: Calendar,
      description: "Latest games added to our collection",
      count: newReleases.length,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Trending & New Games
          </h1>
          <p className="text-gray-400">
            Discover the hottest games and latest releases
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`-ml-0.5 mr-2 h-5 w-5 ${
                        isActive ? "text-blue-400" : "text-gray-400"
                      }`}
                    />
                    {tab.name}
                    {tab.count > 0 && (
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                          isActive
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {/* Trending Games Tab */}
          {activeTab === "trending" && (
            <div>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Trending Games
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Games with the highest ratings and most activity
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Star className="w-4 h-4" />
                  <span>Sorted by rating</span>
                </div>
              </div>

              {/* Loading State */}
              {trendingLoading && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              )}

              {/* Games Grid */}
              {!trendingLoading && trendingGames.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trendingGames.map((game) => (
                    <GameCard
                      key={game._id}
                      game={game}
                      size="large"
                      showActions={true}
                      showDetails={true}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!trendingLoading && trendingGames.length === 0 && (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    No trending games found
                  </h3>
                  <p className="text-gray-500">
                    Check back later for trending games
                  </p>
                </div>
              )}
            </div>
          )}

          {/* New Releases Tab */}
          {activeTab === "new" && (
            <div>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      New Releases
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Latest games added to our collection
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Sorted by release date</span>
                </div>
              </div>

              {/* Loading State */}
              {newLoading && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              )}

              {/* Games Grid */}
              {!newLoading && newReleases.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {newReleases.map((game) => (
                    <GameCard
                      key={game._id}
                      game={game}
                      size="large"
                      showActions={true}
                      showDetails={true}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!newLoading && newReleases.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    No new releases found
                  </h3>
                  <p className="text-gray-500">
                    Check back later for new releases
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrendingAndNewPage;
