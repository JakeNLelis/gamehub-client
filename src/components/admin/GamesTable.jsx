import React from "react";
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
  // Show loading spinner when initially loading data
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">No games found.</div>
    );
  }

  return (
    <div className="relative">
      {isFetching && (
        <div className="absolute inset-0 bg-slate-800 bg-opacity-50 z-10 flex items-center justify-center">
          <div className="bg-slate-700 rounded-lg shadow-lg p-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-sm text-gray-300">Loading...</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-600">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Game
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Genre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-600">
            {games.map((game) => (
              <tr
                key={game._id}
                className="hover:bg-slate-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {game.title}
                      </div>
                      <div className="text-sm text-gray-400">
                        {game.developer}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {game.genre.map((g, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {game.platform.map((p, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-sm text-white">
                      {game.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">
                      ({game.totalReviews})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(game.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(game)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(game._id, game.title)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      disabled={deleteGameMutation.isPending}
                    >
                      {deleteGameMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-300">
            Showing {(pagination.currentPage - 1) * pagination.gamesPerPage + 1}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.gamesPerPage,
              pagination.totalGames
            )}{" "}
            of {pagination.totalGames} games
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-2 border border-slate-600 rounded-md text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border border-slate-600 rounded-md text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesTable;
