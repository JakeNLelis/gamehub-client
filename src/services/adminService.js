import api from "./api.js";

export const adminService = {
  // Get admin dashboard stats
  async getStats() {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  // Game management
  async getGames(params = {}) {
    const response = await api.get("/admin/games", { params });
    return response.data;
  },

  async createGame(gameData) {
    const response = await api.post("/admin/games", gameData);
    return response.data;
  },

  async updateGame(gameId, gameData) {
    const response = await api.put(`/admin/games/${gameId}`, gameData);
    return response.data;
  },

  async deleteGame(gameId) {
    const response = await api.delete(`/admin/games/${gameId}`);
    return response.data;
  },

  // Review management
  async getReviews(params = {}) {
    const response = await api.get("/admin/reviews", { params });
    return response.data;
  },

  async deleteReview(reviewId) {
    const response = await api.delete(`/admin/reviews/${reviewId}`);
    return response.data;
  },

  // User management (superadmin only)
  async getUsers(params = {}) {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  async updateUserRole(userId, role) {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  async promoteUser(userId) {
    const response = await api.post(`/admin/users/${userId}/promote`);
    return response.data;
  },

  async demoteUser(userId) {
    const response = await api.post(`/admin/users/${userId}/demote`);
    return response.data;
  },

  // Image upload
  async uploadThumbnail(file) {
    const formData = new FormData();
    formData.append("thumbnail", file);

    const response = await api.post("/admin/upload/thumbnail", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async uploadBackground(file) {
    const formData = new FormData();
    formData.append("background", file);

    const response = await api.post("/admin/upload/background", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default adminService;
