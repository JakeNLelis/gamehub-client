import api from "./api.js";

export const authService = {
  // Get current user profile
  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Refresh token
  async refreshToken(refreshToken) {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  // Logout user
  async logout() {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Delete account
  async deleteAccount() {
    const response = await api.delete("/auth/delete-account");
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  // Upload avatar
  async uploadAvatar(avatarFile) {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await api.post("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  // Delete avatar
  async deleteAvatar() {
    const response = await api.delete("/users/avatar");
    return response.data;
  },
  // Initiate Google OAuth
  initiateGoogleAuth() {
    // Store current location for redirect after auth
    sessionStorage.setItem("intendedPath", window.location.pathname);

    // Redirect to Google OAuth endpoint
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },
};
