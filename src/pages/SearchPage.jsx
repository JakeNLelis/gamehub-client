import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import GameSearch from "../components/common/GameSearch.jsx";
import GameCard from "../components/common/GameCard.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import Footer from "../components/layout/Footer.jsx";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearchParams, setCurrentSearchParams] = useState(null);
  // Get initial search query from URL parameters
  const initialQuery = searchParams.get("q") || "";

  // Function to load all games with pagination
  const loadAllGames = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const { gameService } = await import("../services/gameService.js");
      const response = await gameService.getGames({
        page,
        limit: 20,
      });

      if (response.success) {
        setSearchResults(response.data);
        setPagination(response.pagination);

        // Set search params for pagination (indicating this is showing all games)
        setCurrentSearchParams({
          page,
          limit: 20,
          isAllGames: true, // Flag to indicate this is showing all games
        });
      }
    } catch (error) {
      console.error("Error loading all games:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle pagination
  const handlePageChange = async (newPage) => {
    if (!currentSearchParams || isLoading) return;

    setIsLoading(true);

    try {
      // Check if we're showing all games
      if (currentSearchParams.isAllGames) {
        await loadAllGames(newPage);
        return;
      }

      // Import the game service
      const { gameService } = await import("../services/gameService.js");

      // Update the search parameters with new page
      const updatedParams = {
        ...currentSearchParams,
        page: newPage,
      };

      let response; // Check if it's a basic search or advanced search
      if (currentSearchParams.isAdvancedSearch) {
        // For advanced search, use advancedSearchGames
        response = await gameService.advancedSearchGames(updatedParams);
      } else {
        // For basic search, use searchGames with the search query
        const searchQuery = currentSearchParams.search;
        const { search, isAdvancedSearch, ...otherParams } = updatedParams; // eslint-disable-line no-unused-vars
        response = await gameService.searchGames(searchQuery, otherParams);
      }

      if (response.success) {
        setSearchResults(response.data);
        setPagination(response.pagination);

        // Update current search params to reflect the new page
        setCurrentSearchParams(updatedParams);

        // Update URL params to reflect current page
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("q")) {
          setSearchParams({ q: urlParams.get("q"), page: newPage });
        }
      }
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search results
  const handleSearchResults = useCallback(
    (results, paginationData, searchParams = null) => {
      setSearchResults(results);
      setPagination(paginationData);
      setIsLoading(false);

      // Store search parameters for pagination
      if (searchParams) {
        // Ensure page is set to 1 for new searches
        const normalizedParams = {
          ...searchParams,
          page: searchParams.page || 1,
        };
        setCurrentSearchParams(normalizedParams);
      } // Update URL with search query if it exists
      if (results.length > 0) {
        const currentQuery = new URLSearchParams(window.location.search).get(
          "q"
        );
        if (currentQuery) {
          setSearchParams({ q: currentQuery });
        }
      }
    },
    [setSearchParams]
  ); // Handle clearing results
  const handleClearResults = useCallback(() => {
    setSearchParams({});
    sessionStorage.removeItem("searchResults");
    // Load all games again instead of just clearing
    loadAllGames();
  }, [setSearchParams, loadAllGames]);
  // Load all games by default or restore from session storage
  useEffect(() => {
    const savedResults = sessionStorage.getItem("searchResults");
    if (savedResults) {
      try {
        const {
          results,
          pagination: savedPagination,
          searchParams: savedSearchParams,
        } = JSON.parse(savedResults);
        setSearchResults(results);
        setPagination(savedPagination);

        // Restore search parameters for pagination
        if (savedSearchParams) {
          setCurrentSearchParams(savedSearchParams);
        }

        sessionStorage.removeItem("searchResults");
      } catch {
        sessionStorage.removeItem("searchResults");
      }
    } else {
      // Load all games by default if no saved results and no initial query
      const currentQuery = searchParams.get("q");
      if (!currentQuery) {
        loadAllGames();
      }
    }
  }, [searchParams, loadAllGames]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Search Games</h1>
          <p className="text-gray-400">
            Discover your next favorite game with advanced search and filtering
          </p>
        </div>

        {/* Search Component */}
        <div className="mb-8">
          <GameSearch
            onSearchResults={handleSearchResults}
            onClearResults={handleClearResults}
            className="w-full"
            initialQuery={initialQuery}
          />
        </div>

        {/* Search Results */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {searchResults.length > 0 && (
          <div>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {currentSearchParams?.isAllGames
                  ? "All Games"
                  : "Search Results"}
                {pagination && (
                  <span className="text-gray-400 text-base font-normal ml-2">
                    ({pagination.totalGames} games{" "}
                    {currentSearchParams?.isAllGames ? "total" : "found"})
                  </span>
                )}
              </h2>
            </div>{" "}
            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((game) => (
                <GameCard
                  key={game._id}
                  game={game}
                  size="large"
                  showActions={false}
                  showDetails={true}
                />
              ))}
            </div>
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {/* Previous Page */}{" "}
                  <button
                    disabled={pagination.currentPage === 1 || isLoading}
                    onClick={() => {
                      handlePageChange(pagination.currentPage - 1);
                    }}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                  >
                    Previous
                  </button>{" "}
                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {(() => {
                      const currentPage = pagination.currentPage;
                      const totalPages = pagination.totalPages;
                      const pages = [];

                      // Show all pages if 8 or fewer, otherwise implement sliding window
                      if (totalPages <= 8) {
                        // Show all pages
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        // Sliding window logic for more than 8 pages
                        let start = Math.max(1, currentPage - 2);
                        let end = Math.min(totalPages, currentPage + 2);

                        // Adjust if we're near the beginning
                        if (currentPage <= 3) {
                          end = Math.min(5, totalPages);
                        }

                        // Adjust if we're near the end
                        if (currentPage >= totalPages - 2) {
                          start = Math.max(1, totalPages - 4);
                        }

                        // Always show first page
                        if (start > 1) {
                          pages.push(1);
                          if (start > 2) {
                            pages.push("...");
                          }
                        }

                        // Add pages in the window
                        for (let i = start; i <= end; i++) {
                          pages.push(i);
                        }

                        // Always show last page
                        if (end < totalPages) {
                          if (end < totalPages - 1) {
                            pages.push("...");
                          }
                          pages.push(totalPages);
                        }
                      }

                      return pages.map((page, index) => {
                        if (page === "...") {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-3 py-2 text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                        const isActive = page === currentPage;
                        return (
                          <button
                            key={page}
                            disabled={isLoading}
                            onClick={() => {
                              handlePageChange(page);
                            }}
                            className={`px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}
                  </div>{" "}
                  {/* Next Page */}
                  <button
                    disabled={
                      pagination.currentPage === pagination.totalPages ||
                      isLoading
                    }
                    onClick={() => {
                      handlePageChange(pagination.currentPage + 1);
                    }}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results Message - only show when there was an actual search */}
        {!isLoading &&
          searchResults.length === 0 &&
          currentSearchParams &&
          !currentSearchParams.isAllGames && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                No search results found
              </div>
              <p className="text-gray-500">
                Try adjusting your search terms or filters to find more games
              </p>{" "}
            </div>
          )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
