import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminService from "../../services/adminService";
import LoadingSpinner from "../common/LoadingSpinner";
import GameForm from "./GameForm";
import GamesTable from "./GamesTable";

const GameManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page when searching
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["admin-games", currentPage, debouncedSearch],
    queryFn: () =>
      adminService.getGames({
        page: currentPage,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
      }),
    keepPreviousData: true, // This keeps the previous data while fetching new data
  });

  const deleteGameMutation = useMutation({
    mutationFn: (gameId) => adminService.deleteGame(gameId),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-games"]);
      queryClient.invalidateQueries(["admin-stats"]);
    },
  });

  const handleEdit = (game) => {
    setEditingGame(game);
    setShowForm(true);
  };

  const handleDelete = async (gameId, title) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${title}"? This will also delete all associated reviews.`
      )
    ) {
      deleteGameMutation.mutate(gameId);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingGame(null);
  };

  // Only show full loading spinner on initial load (no previous data and no search)
  if (isLoading && !data && !debouncedSearch) {
    return (
      <div className="p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400">
        Error loading games: {error.message}
      </div>
    );
  }

  const { data: games = [], pagination = {} } = data || {};

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Game Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Game
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
        />
        {search !== debouncedSearch && (
          <div className="text-xs text-gray-400 mt-1 flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-2"></div>
            Searching...
          </div>
        )}
        {isFetching && search === debouncedSearch && (
          <div className="text-xs text-blue-400 mt-1 flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400 mr-2"></div>
            Updating results...
          </div>
        )}
      </div>

      {/* Games Table */}
      <GamesTable
        games={games}
        pagination={pagination}
        isFetching={isFetching}
        isLoading={isLoading && !data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteGameMutation={deleteGameMutation}
        setCurrentPage={setCurrentPage}
      />

      {/* Game Form Modal */}
      {showForm && (
        <GameForm
          game={editingGame}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            queryClient.invalidateQueries(["admin-games"]);
            queryClient.invalidateQueries(["admin-stats"]);
          }}
        />
      )}
    </div>
  );
};

export default GameManagement;
