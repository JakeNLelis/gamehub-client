import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminService from "../../services/adminService";
import LoadingSpinner from "../common/LoadingSpinner";

const ReviewManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

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
      <h2 className="text-2xl font-bold text-white mb-6">Review Management</h2>

      {/* Reviews Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-600">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Game
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Review
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-600">
            {reviews.map((review) => (
              <tr
                key={review._id}
                className="hover:bg-slate-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {review.userId?.name || "Unknown User"}
                  </div>
                  <div className="text-sm text-gray-400">
                    {review.userId?.email || "No email"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {review.gameId?.title || "Unknown Game"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                    <span className="ml-2 text-sm text-gray-400">
                      ({review.rating}/5)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white max-w-xs truncate">
                    {review.content || "No review content"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() =>
                      handleDelete(
                        review._id,
                        review.gameId?.title || "Unknown Game",
                        review.userId?.name || "Unknown User"
                      )
                    }
                    className="text-red-400 hover:text-red-300 transition-colors"
                    disabled={deleteReviewMutation.isPending}
                  >
                    {deleteReviewMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
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
            Showing{" "}
            {((pagination.currentPage || 1) - 1) *
              (pagination.reviewsPerPage || 10) +
              1}{" "}
            to{" "}
            {Math.min(
              (pagination.currentPage || 1) * (pagination.reviewsPerPage || 10),
              pagination.totalReviews || 0
            )}{" "}
            of {pagination.totalReviews || 0} reviews
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((pagination.currentPage || 1) - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-2 border border-slate-600 rounded-md text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((pagination.currentPage || 1) + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border border-slate-600 rounded-md text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {reviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No reviews found.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
