import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { authService } from "../services/authService.js";
import { AuthContext } from "./AuthContext.jsx";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get("authToken");
      if (token) {
        const response = await authService.getCurrentUser();
        if (response.success) {
          setUser(response.user);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear invalid tokens
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      authService.initiateGoogleAuth();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state and cookies regardless of API response
      setUser(null);
      setIsAuthenticated(false);
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      setUser(null);
      setIsAuthenticated(false);
      Cookies.remove("authToken");
      Cookies.remove("refreshToken");
      return { success: true };
    } catch (error) {
      console.error("Delete account error:", error);
      return { success: false, error: error.message };
    }
  }; // Handle OAuth callback
  const handleOAuthCallback = (token, refreshToken) => {
    if (token) {
      Cookies.set("authToken", token, { expires: 7 });
      if (refreshToken) {
        Cookies.set("refreshToken", refreshToken, { expires: 30 });
      }
      checkAuthStatus();
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    deleteAccount,
    handleOAuthCallback,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
