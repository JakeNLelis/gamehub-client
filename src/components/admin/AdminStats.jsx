import React from "react";
import { useQuery } from "@tanstack/react-query";
import adminService from "../../services/adminService";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminStats = () => {
  const {
    data: statsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getStats(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-red-400 font-semibold text-lg">
              Error Loading Dashboard
            </h3>
          </div>
          <p className="text-red-300 text-sm mb-4">
            {error.message || "Unable to load dashboard statistics"}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where stats data might be incomplete
  const stats = statsResponse?.data || {};
  const { overview = {}, recentActivity = {}, insights = {} } = stats;
  const {
    totalGames = 0,
    totalUsers = 0,
    totalReviews = 0,
    totalAdmins = 0,
    growthStats = {},
  } = overview;
  const { recentGames = [], recentReviews = [] } = recentActivity;
  const {
    topRatedGames = [],
    genreDistribution = [],
    monthlyStats = [],
  } = insights;

  // Chart colors
  const COLORS = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#6366F1",
    "#84CC16",
  ];

  // Prepare chart data
  const genreChartData = genreDistribution.map((genre) => ({
    name: genre._id,
    count: genre.count,
    avgRating: genre.avgRating || 0,
  }));

  const monthlyChartData = monthlyStats.map((stat) => ({
    month: `${stat._id.month}/${stat._id.year}`,
    reviews: stat.count,
    avgRating: stat.avgRating || 0,
  }));

  const StatCard = ({ title, value, change, icon, color, trend }) => (
    <div
      className={`bg-slate-800 rounded-xl p-6 border border-${color}-500/20 hover:border-${color}-500/40 transition-all duration-300 shadow-lg hover:shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}
          >
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <p
              className={`text-sm font-medium text-${color}-400 uppercase tracking-wider`}
            >
              {title}
            </p>
            <p className="text-2xl font-bold text-white">
              {value.toLocaleString()}
            </p>
          </div>
        </div>
        {change && (
          <div
            className={`flex items-center space-x-1 ${
              trend === "up" ? "text-green-400" : "text-red-400"
            }`}
          >
            <span className="text-sm">{trend === "up" ? "↗️" : "↘️"}</span>
            <span className="text-sm font-semibold">{change}%</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h2>
          <p className="text-gray-400">
            Real-time insights into your GameHub platform
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Games"
          value={totalGames}
          change={growthStats.games}
          icon="🎮"
          color="blue"
          trend="up"
        />
        <StatCard
          title="Total Users"
          value={totalUsers}
          change={growthStats.users}
          icon="👥"
          color="green"
          trend="up"
        />
        <StatCard
          title="Total Reviews"
          value={totalReviews}
          change={growthStats.reviews}
          icon="⭐"
          color="yellow"
          trend="up"
        />
        <StatCard
          title="Administrators"
          value={totalAdmins}
          icon="�️"
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Distribution Chart */}
        {genreChartData.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <span>📊</span>
              <span>Genre Distribution</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genreChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Monthly Reviews Trend */}
        {monthlyChartData.length > 0 && (
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <span>📈</span>
              <span>Review Activity Trend</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  dot={{ fill: "#06B6D4", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Games */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <span>🎮</span>
            <span>Recently Added Games</span>
          </h3>
          <div className="space-y-4">
            {recentGames.length > 0 ? (
              recentGames.map((game) => (
                <div
                  key={game._id}
                  className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <img
                    src={game.thumbnail || "/placeholder-game.jpg"}
                    alt={game.title}
                    className="w-14 h-14 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-game.jpg";
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{game.title}</p>
                    <p className="text-sm text-gray-400">{game.developer}</p>
                    <p className="text-xs text-gray-500">
                      Added {new Date(game.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-2 block">📭</span>
                <p className="text-gray-400">No recent games</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <span>💬</span>
            <span>Latest Reviews</span>
          </h3>
          <div className="space-y-4">
            {recentReviews.length > 0 ? (
              recentReviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-white">
                      {review.userId?.name || "Unknown User"}
                    </p>
                    <div className="flex items-center space-x-1">
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
                  <p className="text-sm text-gray-300 mb-1">
                    {review.gameId?.title || "Unknown Game"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-2 block">💭</span>
                <p className="text-gray-400">No recent reviews</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Rated Games */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <span>🏆</span>
          <span>Top Rated Games</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topRatedGames.length > 0 ? (
            topRatedGames.map((game, index) => (
              <div
                key={game._id}
                className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <img
                  src={game.thumbnail || "/placeholder-game.jpg"}
                  alt={game.title}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-game.jpg";
                  }}
                />
                <div className="flex-1">
                  <p className="font-semibold text-white">{game.title}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-sm text-gray-300 ml-1">
                        {game.averageRating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      ({game.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <span className="text-4xl mb-2 block">🎯</span>
              <p className="text-gray-400">No top rated games yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
