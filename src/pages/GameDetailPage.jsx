import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { gameService } from "../services/gameService.js";
import {
  Heart,
  Star,
  MessageSquare,
  ArrowLeft,
  Calendar,
  Monitor,
  User,
  Trash2,
  Edit3,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import Footer from "../components/layout/Footer.jsx";

const GameDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false); // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userReview, setUserReview] = useState(null);

  // Load game data
  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        const response = await gameService.getGameById(id);
        if (response.success) {
          setGame(response.data);
        } else {
          console.error("Failed to load game:", response.message);
        }
      } catch (error) {
        console.error("Error loading game:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadGame();
    }
  }, [id]);
  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await gameService.getGameReviews(id);
        if (response.success && response.data) {
          setReviews(response.data.reviews || []);
          // Find user's review if exists
          if (isAuthenticated && user && response.data.reviews) {
            const userRev = response.data.reviews.find(
              (review) => review.userId._id === user._id
            );
            setUserReview(userRev);
          }
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
        setReviews([]); // Set empty array on error
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      loadReviews();
    }
  }, [id, isAuthenticated, user]);
  // Check favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const response = await gameService.checkFavorite(id);
        if (response.success && response.data) {
          setIsFavorite(response.data.isFavorite);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    if (id && isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [id, isAuthenticated, user]);

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setFavoriteLoading(true);
      if (isFavorite) {
        await gameService.removeFromFavorites(id);
        setIsFavorite(false);
      } else {
        await gameService.addToFavorites(id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      setReviewSubmitting(true);
      const reviewData = {
        rating: reviewRating,
        content: reviewText.trim(),
      };

      const response = await gameService.createOrUpdateReview(id, reviewData);
      if (response.success) {
        // Reload reviews to get updated data
        const reviewsResponse = await gameService.getGameReviews(id);
        if (reviewsResponse.success && reviewsResponse.data) {
          setReviews(reviewsResponse.data.reviews || []);
          const userRev = reviewsResponse.data.reviews?.find(
            (review) => review.userId._id === user._id
          );
          setUserReview(userRev);
        } // Reset form
        setShowReviewForm(false);
        setEditingReview(null);
        setReviewText("");
        setReviewRating(5);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setReviewSubmitting(false);
    }
  }; // Handle review edit
  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewText(review.content || review.comment || "");
    setReviewRating(review.rating);
    setShowReviewForm(true);
  };

  // Handle review delete
  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      await gameService.deleteReview(reviewId); // Reload reviews
      const reviewsResponse = await gameService.getGameReviews(id);
      if (reviewsResponse.success && reviewsResponse.data) {
        setReviews(reviewsResponse.data.reviews || []);
        setUserReview(null);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Game Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Game Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Game Image */}
          <div className="relative">
            <img
              src={
                game.thumbnail ||
                "https://via.placeholder.com/600x400?text=Game"
              }
              alt={game.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x400?text=Game";
              }}
            />

            {/* Favorite Button Overlay */}
            <button
              onClick={handleFavoriteToggle}
              disabled={favoriteLoading}
              className={`absolute top-4 right-4 p-3 rounded-full transition-colors ${
                isFavorite
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-slate-800/80 hover:bg-slate-700"
              }`}
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "text-white fill-current" : "text-gray-300"
                }`}
              />
            </button>
          </div>

          {/* Game Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{game.title}</h1>

            {/* Rating and Reviews Summary */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-2 rounded-lg">
                <span className="text-lg font-semibold">
                  {game.averageRating.toFixed(1)}
                </span>
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <span className="text-gray-400">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>

            {/* Game Details */}
            <div className="space-y-3 mb-6">
              {game.genre && (
                <div>
                  <span className="font-semibold text-gray-300">Genre: </span>
                  <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-sm">
                    {game.genre}
                  </span>
                </div>
              )}

              {game.platform && (
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{game.platform}</span>
                </div>
              )}

              {game.releaseDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    Released: {new Date(game.releaseDate).getFullYear()}
                  </span>
                </div>
              )}

              {game.developer && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    Developer: {game.developer}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  {!userReview ? (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Write a Review</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReview(userReview)}
                        className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Review</span>
                      </button>
                      <button
                        onClick={() => handleDeleteReview(userReview._id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Login to Review & Favorite
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Game Description */}
        {(game.shortDescription || game.short_description) && (
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Game</h2>
            <p className="text-gray-300 leading-relaxed">
              {game.shortDescription || game.short_description}
            </p>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">
              {editingReview ? "Edit Your Review" : "Write a Review"}
            </h3>{" "}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`w-8 h-8 rounded ${
                        star <= reviewRating
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>{" "}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this game..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  rows={4}
                  maxLength={1000}
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {reviewSubmitting
                    ? "Submitting..."
                    : editingReview
                    ? "Update Review"
                    : "Submit Review"}
                </button>{" "}
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setEditingReview(null);
                    setReviewText("");
                    setReviewRating(5);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">
            Reviews ({reviews.length})
          </h2>

          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-slate-700 pb-6 last:border-b-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {review.userId.profilePicture ? (
                        <img
                          src={review.userId.profilePicture}
                          alt={review.userId.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {review.userId.name?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </span>
                        </div>
                      )}{" "}
                      <div>
                        <h4 className="font-semibold text-white">
                          {review.userId.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-500"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>{" "}
                    <span className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {review.content || review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                No reviews yet. Be the first to review this game!
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GameDetailPage;
