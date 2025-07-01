import React from "react";
import { useQuery } from "@tanstack/react-query";
import adminService from "../../services/adminService";
import LoadingSpinner from "../common/LoadingSpinner";

const AdminStats = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getStats(),
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold mb-2">
            Error Loading Statistics
          </h3>
          <p className="text-red-300 text-sm">
            {error.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle case where stats data might be incomplete
  const safeStats = stats || {};
  const { overview = {}, recentActivity = {}, insights = {} } = safeStats;
  const {
    totalGames = 0,
    totalUsers = 0,
    totalReviews = 0,
    totalAdmins = 0,
  } = overview;
  const { recentGames = [], recentReviews = [] } = recentActivity;
  const { topRatedGames = [] } = insights;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-700 p-6 rounded-lg border border-blue-500/20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎮</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-400">Total Games</p>
              <p className="text-2xl font-bold text-white">{totalGames}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 p-6 rounded-lg border border-green-500/20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 p-6 rounded-lg border border-yellow-500/20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-400">
                Total Reviews
              </p>
              <p className="text-2xl font-bold text-white">{totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 p-6 rounded-lg border border-purple-500/20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🛡️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-400">Admins</p>
              <p className="text-2xl font-bold text-white">{totalAdmins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Games */}
        <div className="bg-slate-700 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Games
          </h3>
          <div className="space-y-3">
            {recentGames.length > 0 ? (
              recentGames.map((game) => (
                <div key={game._id} className="flex items-center space-x-3">
                  <img
                    src={game.thumbnail || "/placeholder-game.jpg"}
                    alt={game.title}
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-game.jpg";
                    }}
                  />
                  <div>
                    <p className="font-medium text-white">{game.title}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(game.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No recent games</p>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-slate-700 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Reviews
          </h3>
          <div className="space-y-3">
            {recentReviews.length > 0 ? (
              recentReviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-slate-600 pb-3 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">
                      {review.userId?.name || "Unknown User"}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {review.gameId?.title || "Unknown Game"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No recent reviews</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Rated Games */}
      <div className="bg-slate-700 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Top Rated Games
        </h3>
        <div className="space-y-3">
          {topRatedGames.length > 0 ? (
            topRatedGames.map((game, index) => (
              <div key={game._id} className="flex items-center space-x-3">
                <span className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <img
                  src={game.thumbnail || "/placeholder-game.jpg"}
                  alt={game.title}
                  className="w-12 h-12 rounded object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-game.jpg";
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium text-white">{game.title}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-sm text-gray-300 ml-1">
                        {game.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      ({game.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No top rated games yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
