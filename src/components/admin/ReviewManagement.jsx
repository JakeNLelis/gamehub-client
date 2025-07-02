import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import LoadingSpinner from "../common/LoadingSpinner";

const ReviewManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleReviewClick = (gameId) => {
    if (gameId) {
      navigate(`/game/${gameId}`);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-reviews", currentPage],
    queryFn: () =>
      adminService.getReviews({
        page: currentPage,
        limit: 10,
      }),
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId) => adminService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reviews"]);
      queryClient.invalidateQueries(["admin-stats"]);
    },
  });

  const handleDelete = async (reviewId, gameName, userName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the review by ${userName} for "${gameName}"?`
      )
    ) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

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
            Error Loading Reviews
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

  const { data: reviews = [], pagination = {} } = data || {};

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Review Management
          </h2>
          <p className="text-gray-400">
            Manage and moderate user reviews across your platform
          </p>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-600">
            <thead className="bg-slate-750">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>👤</span>
                    <span>User</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>🎮</span>
                    <span>Game</span>
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
                    <span>💬</span>
                    <span>Review</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>Date</span>
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
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleReviewClick(review.gameId?._id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {(review.userId?.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {review.userId?.name || "Unknown User"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {review.userId?.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {review.gameId?.title || "Unknown Game"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Click to view game
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-500"
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-400 bg-slate-700 px-2 py-1 rounded-full">
                        {review.rating}/5
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm text-white line-clamp-2 leading-5">
                        {review.content || "No review content"}
                      </div>
                      {review.content && review.content.length > 100 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {review.content.length} characters
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(
                          review._id,
                          review.gameId?.title || "Unknown Game",
                          review.userId?.name || "Unknown User"
                        );
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/20 hover:bg-red-500/30 hover:text-red-300 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={deleteReviewMutation.isPending}
                    >
                      {deleteReviewMutation.isPending
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <span className="font-medium">Showing</span>
            <span className="px-3 py-1 bg-purple-600 text-white rounded-full font-semibold">
              {((pagination.currentPage || 1) - 1) *
                (pagination.reviewsPerPage || 10) +
                1}
            </span>
            <span>to</span>
            <span className="px-3 py-1 bg-purple-600 text-white rounded-full font-semibold">
              {Math.min(
                (pagination.currentPage || 1) *
                  (pagination.reviewsPerPage || 10),
                pagination.totalReviews || 0
              )}
            </span>
            <span>of</span>
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full font-semibold">
              {pagination.totalReviews || 0}
            </span>
            <span>reviews</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={pagination.currentPage === 1}
              className="inline-flex items-center px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
              title="First page"
            >
              <span>⏮️</span>
            </button>

            <button
              onClick={() => setCurrentPage((pagination.currentPage || 1) - 1)}
              disabled={!pagination.hasPreviousPage}
              className="inline-flex items-center px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
            >
              <span className="mr-2">←</span>
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((pagination.currentPage || 1) + 1)}
              disabled={!pagination.hasNextPage}
              className="inline-flex items-center px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
            >
              Next
              <span className="ml-2">→</span>
            </button>

            <button
              onClick={() => setCurrentPage(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="inline-flex items-center px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700"
              title="Last page"
            >
              <span>⏭️</span>
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Empty State */}
      {reviews.length === 0 && (
        <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Reviews Found
          </h3>
          <p className="text-gray-400">
            Reviews will appear here as users submit them for games.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
