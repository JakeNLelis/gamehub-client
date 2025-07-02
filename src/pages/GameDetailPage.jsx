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
  ExternalLink,
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
        // Optimistically update the favorites count
        setGame((prev) => ({
          ...prev,
          inPlayersFavorites: Math.max(0, (prev.inPlayersFavorites || 0) - 1),
        }));
      } else {
        await gameService.addToFavorites(id);
        setIsFavorite(true);
        // Optimistically update the favorites count
        setGame((prev) => ({
          ...prev,
          inPlayersFavorites: (prev.inPlayersFavorites || 0) + 1,
        }));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert optimistic update on error
      if (isFavorite) {
        setGame((prev) => ({
          ...prev,
          inPlayersFavorites: (prev.inPlayersFavorites || 0) + 1,
        }));
      } else {
        setGame((prev) => ({
          ...prev,
          inPlayersFavorites: Math.max(0, (prev.inPlayersFavorites || 0) - 1),
        }));
      }
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
    <div className="min-h-screen bg-slate-900 text-white relative">
      {/* Background Image with Limited Height */}
      {game.backgroundImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="relative w-full h-[150vh]">
            <img
              src={game.backgroundImage}
              alt={`${game.title} background`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-slate-900/60"></div>
            {/* Gradient fade to background color */}
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          {/* Header with Back Button and Edit Button */}
          <div className="flex justify-between items-center mb-6">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            {/* Admin Edit Button */}
            {isAuthenticated &&
              user &&
              (user.role === "admin" || user.role === "superadmin") && (
                <button
                  onClick={() => navigate(`/admin?tab=games&edit=${game._id}`)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Game</span>
                </button>
              )}
          </div>

          {/* Game Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Game Image */}
            <div className="relative">
              <img
                src={
                  game.thumbnail ||
                  "https://via.placeholder.com/800x450?text=Game"
                }
                alt={game.title}
                className="w-full aspect-video object-contain bg-slate-800 rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x450?text=Game";
                }}
              />
              {/* Favorite Button */}
              <button
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  isFavorite
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-slate-800/80 hover:bg-slate-700 text-gray-300"
                } ${favoriteLoading ? "animate-pulse" : ""}`}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Game Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Game Title */}
              <div>
                <h1 className="text-4xl font-bold mb-4">{game.title}</h1>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">
                      {game.averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-400">
                      ({reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>

                  {/* Favorites Count */}
                  {game.inPlayersFavorites > 0 && (
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-400 fill-current" />
                      <span className="text-gray-400">
                        {game.inPlayersFavorites.toLocaleString()}{" "}
                        {game.inPlayersFavorites === 1
                          ? "favorite"
                          : "favorites"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Game Details */}
              <div className="space-y-4">
                {/* Genre */}
                {game.genre && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Genre
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(game.genre) ? (
                        game.genre.map((g, index) => (
                          <span
                            key={index}
                            className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                          >
                            {g}
                          </span>
                        ))
                      ) : (
                        <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                          {game.genre}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Platform */}
                {game.platform && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Platform
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(game.platform) ? (
                        game.platform.map((p, index) => (
                          <span
                            key={index}
                            className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                          >
                            <Monitor className="w-3 h-3" />
                            <span>{p}</span>
                          </span>
                        ))
                      ) : (
                        <span className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                          <Monitor className="w-3 h-3" />
                          <span>{game.platform}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.releaseDate && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Release Date
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(game.releaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {game.developer && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Developer
                      </h3>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{game.developer}</span>
                      </div>
                    </div>
                  )}

                  {game.publisher && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Publisher
                      </h3>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{game.publisher}</span>
                      </div>
                    </div>
                  )}

                  {/* Community Favorites */}
                  {game.inPlayersFavorites >= 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Community Favorites
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-400 fill-current" />
                        <span>
                          {game.inPlayersFavorites > 0
                            ? `${game.inPlayersFavorites.toLocaleString()} members`
                            : "Be the first"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Play Game Button */}
                {game.gameUrl && (
                  <a
                    href={game.gameUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-white no-underline"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Play Game</span>
                  </a>
                )}

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
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
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
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {game.shortDescription || game.short_description}
              </p>
            </div>
          )}

          {/* System Requirements */}
          {(game.minOS ||
            game.minMemory ||
            game.minStorage ||
            game.minProcessor ||
            game.minGraphics) && (
            <div className="bg-slate-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <Monitor className="w-6 h-6" />
                <span>System Requirements</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {game.minOS && (
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">
                      Operating System
                    </div>
                    <div className="text-white font-medium">{game.minOS}</div>
                  </div>
                )}
                {game.minProcessor && (
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Processor</div>
                    <div className="text-white font-medium">
                      {game.minProcessor}
                    </div>
                  </div>
                )}
                {game.minMemory && (
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Memory</div>
                    <div className="text-white font-medium">
                      {game.minMemory}
                    </div>
                  </div>
                )}
                {game.minGraphics && (
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Graphics</div>
                    <div className="text-white font-medium">
                      {game.minGraphics}
                    </div>
                  </div>
                )}
                {game.minStorage && (
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Storage</div>
                    <div className="text-white font-medium">
                      {game.minStorage}
                    </div>
                  </div>
                )}
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Storage</div>
                  <div className="text-white font-medium">
                    Specifications may change during development
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-slate-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Edit3 className="w-5 h-5" />
                <span>
                  {editingReview ? "Edit Your Review" : "Write a Review"}
                </span>
              </h3>
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
                        className={`w-8 h-8 rounded transition-colors ${
                          star <= reviewRating
                            ? "text-yellow-400 hover:text-yellow-300"
                            : "text-gray-500 hover:text-gray-400"
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
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
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reviewSubmitting
                      ? "Submitting..."
                      : editingReview
                      ? "Update Review"
                      : "Submit Review"}
                  </button>
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
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <MessageSquare className="w-6 h-6" />
              <span>Reviews ({reviews.length})</span>
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
                    className="bg-slate-700 rounded-lg p-4 border border-slate-600"
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
                        )}
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
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {review.content || review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-500">
                  Be the first to review this game!
                </p>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default GameDetailPage;
