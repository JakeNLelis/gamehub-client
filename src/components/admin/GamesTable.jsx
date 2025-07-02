import React from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

const GamesTable = ({
  games,
  pagination,
  isFetching,
  isLoading,
  onEdit,
  onDelete,
  deleteGameMutation,
  setCurrentPage,
}) => {
  const navigate = useNavigate();

  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  // Show loading spinner when initially loading data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Loading games...</p>
        </div>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No Games Found
        </h3>
        <p className="text-gray-400">
          Start by adding some games to your platform.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isFetching && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
          <div className="bg-slate-800 rounded-xl shadow-2xl p-4 flex items-center space-x-3 border border-slate-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-gray-300 font-medium">
              Refreshing games...
            </span>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-600">
            <thead className="bg-slate-750">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>🎮</span>
                    <span>Game</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>🏷️</span>
                    <span>Genre</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>💻</span>
                    <span>Platform</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>⭐</span>
                    <span>Rating</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>Created</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>⚙️</span>
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {games.map((game, index) => (
                <tr
                  key={game._id}
                  className="hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group relative"
                  onClick={() => handleGameClick(game._id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-16 h-16 rounded-lg object-cover shadow-lg border border-slate-600 group-hover:border-slate-500 transition-colors"
                          onError={(e) => {
                            e.target.src = "/placeholder-game.jpg";
                          }}
                        />
                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                          {game.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          by {game.developer}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {game._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {game.genre.slice(0, 2).map((g, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border border-blue-500/30"
                        >
                          {g}
                        </span>
                      ))}
                      {game.genre.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          +{game.genre.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {game.platform.slice(0, 2).map((p, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30"
                        >
                          {p}
                        </span>
                      ))}
                      {game.platform.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          +{game.platform.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400 text-lg">⭐</span>
                        <span className="text-sm font-semibold text-white">
                          {game.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 bg-slate-700 px-2 py-1 rounded-full">
                        {game.totalReviews || 0} reviews
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      {new Date(game.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(game.createdAt).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(game);
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-blue-400 bg-blue-500/20 hover:bg-blue-500/30 hover:text-blue-300 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(game._id, game.title);
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/20 hover:bg-red-500/30 hover:text-red-300 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={deleteGameMutation.isPending}
                      >
                        {deleteGameMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-col space-y-4 bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
          {/* Stats - Hide on very small screens */}
          <div className="hidden sm:flex items-center justify-center space-x-2 text-sm text-gray-300">
            <span className="font-medium">Showing</span>
            <span className="px-2 py-1 bg-blue-600 text-white rounded-full font-semibold text-xs">
              {(pagination.currentPage - 1) * pagination.gamesPerPage + 1}
            </span>
            <span>to</span>
            <span className="px-2 py-1 bg-blue-600 text-white rounded-full font-semibold text-xs">
              {Math.min(
                pagination.currentPage * pagination.gamesPerPage,
                pagination.totalGames
              )}
            </span>
            <span>of</span>
            <span className="px-2 py-1 bg-purple-600 text-white rounded-full font-semibold text-xs">
              {pagination.totalGames}
            </span>
            <span>games</span>
          </div>

          {/* Mobile stats - Show only on small screens */}
          <div className="sm:hidden text-center text-sm text-gray-300">
            <span className="font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <span className="block text-xs text-gray-400 mt-1">
              ({pagination.totalGames} total games)
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            {/* First page button - Hide on mobile */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={pagination.currentPage === 1}
              className="hidden sm:inline-flex items-center px-2 py-2 border border-slate-600 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
              title="First page"
            >
              <span>⏮️</span>
            </button>

            {/* Previous button */}
            <button
              onClick={() => setCurrentPage(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="inline-flex items-center px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
            >
              <span className="sm:mr-2">←</span>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers - Fewer on mobile */}
            <div className="flex items-center space-x-1">
              {/* Mobile: Show 3 pages, Desktop: Show 5 pages */}
              <div className="flex items-center space-x-1 sm:hidden">
                {[...Array(Math.min(3, pagination.totalPages))].map(
                  (_, index) => {
                    let pageNumber;
                    if (pagination.totalPages <= 3) {
                      pageNumber = index + 1;
                    } else if (pagination.currentPage <= 2) {
                      pageNumber = index + 1;
                    } else if (
                      pagination.currentPage >=
                      pagination.totalPages - 1
                    ) {
                      pageNumber = pagination.totalPages - 2 + index;
                    } else {
                      pageNumber = pagination.currentPage - 1 + index;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-8 h-8 rounded-lg font-semibold text-sm transition-all duration-200 ${
                          pageNumber === pagination.currentPage
                            ? "bg-blue-600 text-white border-2 border-blue-400"
                            : "bg-slate-700 text-gray-300 border border-slate-600 hover:bg-slate-600 hover:text-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Desktop: Show 5 pages */}
              <div className="hidden sm:flex items-center space-x-1">
                {[...Array(Math.min(5, pagination.totalPages))].map(
                  (_, index) => {
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (
                      pagination.currentPage >=
                      pagination.totalPages - 2
                    ) {
                      pageNumber = pagination.totalPages - 4 + index;
                    } else {
                      pageNumber = pagination.currentPage - 2 + index;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                          pageNumber === pagination.currentPage
                            ? "bg-blue-600 text-white border-2 border-blue-400"
                            : "bg-slate-700 text-gray-300 border border-slate-600 hover:bg-slate-600 hover:text-white"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={() => setCurrentPage(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="inline-flex items-center px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:ml-2">→</span>
            </button>

            {/* Last page button - Hide on mobile */}
            <button
              onClick={() => setCurrentPage(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="hidden sm:inline-flex items-center px-2 py-2 border border-slate-600 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
              title="Last page"
            >
              <span>⏭️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesTable;
