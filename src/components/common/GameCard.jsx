import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, MessageSquare } from "lucide-react";

const GameCard = ({
  game,
  size = "large",
  onFavoriteToggle = null,
  onReview = null,
  showActions = true,
  showDetails = true,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/game/${game._id || game.id}`);
  };

  const cardClasses =
    size === "large"
      ? "bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      : "flex items-center space-x-4 bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer";

  const imageClasses =
    size === "large"
      ? "w-full h-48 object-cover"
      : "w-16 h-12 object-cover rounded";
  // Small size card (for lists/compact views)
  if (size === "small") {
    return (
      <div className={cardClasses} onClick={handleCardClick}>
        <img
          src={
            game.thumbnail || "https://via.placeholder.com/300x170?text=Game"
          }
          alt={game.title}
          className={imageClasses}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x170?text=Game";
          }}
        />
        <div className="flex-1">
          <h4 className="font-semibold text-white">{game.title}</h4>{" "}
          {(game.shortDescription || game.short_description) && showDetails && (
            <p className="text-sm text-gray-400 truncate">
              {game.shortDescription || game.short_description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
            {game.platform || "PC"}
          </span>
          {showActions && onFavoriteToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(game._id || game.id);
              }}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
  // Large size card (main display)
  return (
    <div className={cardClasses} onClick={handleCardClick}>
      {/* Game Image */}
      <div className="bg-slate-700 relative">
        <img
          src={
            game.thumbnail || "https://via.placeholder.com/300x170?text=Game"
          }
          alt={game.title}
          className={imageClasses}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x170?text=Game";
          }}
        />

        {/* Hover Actions Overlay for large cards */}
        {showActions && size === "large" && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 right-4 flex items-center space-x-2">
              {onFavoriteToggle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavoriteToggle(game._id || game.id);
                  }}
                  className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors"
                >
                  <Heart className="w-4 h-4 text-white" />
                </button>
              )}
              {onReview && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview(game._id || game.id);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Game Info */}
      {showDetails && (
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {game.title}
          </h3>
          {/* Genres and Rating */}
          {(game.genre || (game.averageRating && game.averageRating > 0)) && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-wrap gap-1">
                {game.genre && (
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">
                    {game.genre}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded">
                <span className="text-sm text-white font-semibold">
                  {game.averageRating.toFixed(1)}
                </span>
                <span className="text-yellow-400 text-base font-bold">⭐</span>
              </div>
            </div>
          )}
          {/* Platforms */}
          {game.platform && (
            <div className="text-sm text-gray-400 mb-2">
              <span className="font-medium">Platform: </span>
              {game.platform}
            </div>
          )}
          {/* Release Date */}
          {game.releaseDate && (
            <div className="text-sm text-gray-400 mb-2">
              Released: {new Date(game.releaseDate).getFullYear()}
            </div>
          )}
          {/* Developer */}
          {game.developer && (
            <div className="text-sm text-gray-400">
              <span className="font-medium">Developer: </span>
              {game.developer}
            </div>
          )}{" "}
        </div>
      )}
    </div>
  );
};

export default GameCard;
