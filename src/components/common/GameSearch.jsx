import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useGameSearch, useFilterMetadata } from "../../hooks/useGames.js";

const GameSearch = ({
  onSearchResults,
  onClearResults,
  className = "",
  initialQuery = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedSortBy, setSelectedSortBy] = useState("relevance");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const filterRef = useRef(null);
  const {
    searchResults,
    loading,
    error,
    pagination,
    searchGames,
    advancedSearch,
    clearSearch,
  } = useGameSearch();
  const { metadata, loading: metadataLoading } = useFilterMetadata();
  // Close filters dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-search when component mounts with initialQuery
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      // Trigger a basic search with the initial query
      const params = {
        page: 1,
        limit: 20,
        "sort-by": selectedSortBy,
      };

      if (selectedCategory) params.category = selectedCategory;
      if (selectedPlatform) params.platform = selectedPlatform;

      searchGames(initialQuery.trim(), params);
    }
  }, [
    initialQuery,
    searchGames,
    selectedCategory,
    selectedPlatform,
    selectedSortBy,
  ]); // Handle search results
  useEffect(() => {
    if (searchResults.length > 0) {
      // Determine which search parameters were used
      const isAdvanced =
        selectedCategory ||
        selectedPlatform ||
        minRating ||
        maxRating ||
        selectedSortBy !== "relevance";
      let searchParams;

      if (isAdvanced) {
        // Advanced search parameters
        searchParams = {
          query: searchQuery,
          limit: 20,
          page: 1,
          isAdvancedSearch: true,
        };

        // Add optional parameters only if they have values
        if (selectedCategory) searchParams.genres = selectedCategory;
        if (selectedPlatform) searchParams.platforms = selectedPlatform;
        if (minRating) searchParams.minRating = parseFloat(minRating);
        if (maxRating) searchParams.maxRating = parseFloat(maxRating);

        // Map sort by value
        if (selectedSortBy !== "relevance") {
          searchParams.sortBy =
            selectedSortBy === "alphabetical"
              ? "title-asc"
              : selectedSortBy === "rating"
              ? "rating-desc"
              : selectedSortBy === "release-date"
              ? "release-date-desc"
              : "relevance";
        }
      } else {
        // Basic search parameters
        searchParams = {
          search: searchQuery,
          limit: 20,
          page: 1,
          isAdvancedSearch: false,
        };

        // Add optional parameters only if they have values
        if (selectedSortBy !== "relevance")
          searchParams["sort-by"] = selectedSortBy;
        if (selectedCategory) searchParams.category = selectedCategory;
        if (selectedPlatform) searchParams.platform = selectedPlatform;
      }

      onSearchResults?.(searchResults, pagination, searchParams);
    }
  }, [
    searchResults,
    pagination,
    onSearchResults,
    searchQuery,
    selectedCategory,
    selectedPlatform,
    selectedSortBy,
    minRating,
    maxRating,
  ]);
  const handleBasicSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      handleClear();
      return;
    }

    const params = {
      page: 1,
      limit: 20,
      "sort-by": selectedSortBy,
    };

    if (selectedCategory) params.category = selectedCategory;
    if (selectedPlatform) params.platform = selectedPlatform;

    await searchGames(searchQuery, params);
  };
  const handleAdvancedSearch = async () => {
    // Map sort values from basic search format to advanced search format
    let mappedSortBy = selectedSortBy;
    switch (selectedSortBy) {
      case "alphabetical":
        mappedSortBy = "title-asc";
        break;
      case "rating":
        mappedSortBy = "rating-desc";
        break;
      case "release-date":
        mappedSortBy = "release-date-desc";
        break;
      case "relevance":
      default:
        mappedSortBy = "relevance";
        break;
    }

    const filters = {
      page: 1,
      limit: 20,
      sortBy: mappedSortBy,
    };

    if (searchQuery.trim()) filters.query = searchQuery;
    if (selectedCategory) filters.genres = selectedCategory;
    if (selectedPlatform) filters.platforms = selectedPlatform;
    if (minRating) filters.minRating = parseFloat(minRating);
    if (maxRating) filters.maxRating = parseFloat(maxRating);

    await advancedSearch(filters);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedPlatform("");
    setSelectedSortBy("relevance");
    setMinRating("");
    setMaxRating("");
    clearSearch();
    onClearResults?.();
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedPlatform ||
    minRating ||
    maxRating ||
    selectedSortBy !== "relevance";

  return (
    <div className={`relative ${className}`}>
      {/* Main Search Bar */}
      <form onSubmit={handleBasicSearch} className="relative">
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-20 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

            {/* Clear button */}
            {(searchQuery || hasActiveFilters) && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-2 p-3 rounded-lg border transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-slate-800 border-slate-700 text-gray-400 hover:text-white hover:border-slate-600"
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="ml-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Advanced Filters Dropdown */}
      {showFilters && (
        <div
          ref={filterRef}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 z-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {!metadataLoading &&
                  metadata?.categories?.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.displayName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">All Platforms</option>
                {!metadataLoading &&
                  metadata?.platforms?.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.displayName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={selectedSortBy}
                onChange={(e) => setSelectedSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                {!metadataLoading &&
                  metadata?.sortOptions?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Rating Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Min"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Max"
                  value={maxRating}
                  onChange={(e) => setMaxRating(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Clear All Filters
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAdvancedSearch();
                  setShowFilters(false);
                }}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded transition-colors disabled:cursor-not-allowed"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedCategory && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-900/50 text-blue-300 border border-blue-500/50">
              Category: {selectedCategory}
              <button
                onClick={() => setSelectedCategory("")}
                className="ml-1 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedPlatform && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-900/50 text-green-300 border border-green-500/50">
              Platform: {selectedPlatform}
              <button
                onClick={() => setSelectedPlatform("")}
                className="ml-1 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(minRating || maxRating) && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-900/50 text-purple-300 border border-purple-500/50">
              Rating: {minRating || "0"} - {maxRating || "5"}
              <button
                onClick={() => {
                  setMinRating("");
                  setMaxRating("");
                }}
                className="ml-1 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedSortBy !== "relevance" && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-900/50 text-yellow-300 border border-yellow-500/50">
              Sort:{" "}
              {metadata?.sortOptions?.find(
                (opt) => opt.value === selectedSortBy
              )?.label || selectedSortBy}
              <button
                onClick={() => setSelectedSortBy("relevance")}
                className="ml-1 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default GameSearch;
