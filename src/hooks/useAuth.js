import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService.js";
import { AuthContext } from "../context/AuthContext.jsx";

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useProfile = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["profile"],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries(["profile"]);
        updateUser(data.user);
      }
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: authService.uploadAvatar,
    onSuccess: (data) => {
      if (data.success && data.user) {
        // Update user context immediately with the response data
        updateUser(data.user);
        // Invalidate queries to ensure fresh data
        queryClient.invalidateQueries(["profile"]);
      }
    },
  });
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  const { updateUser, user } = useAuth();

  return useMutation({
    mutationFn: authService.deleteAvatar,
    onSuccess: (data) => {
      if (data.success && data.user) {
        // Update user context immediately with the response data
        updateUser(data.user);
      } else {
        // Fallback: manually update user to remove avatar
        updateUser({
          ...user,
          avatar: null,
          avatarUrl: null,
        });
      }
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries(["profile"]);
    },
  });
};
