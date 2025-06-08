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
      if (data.success) {
        queryClient.invalidateQueries(["profile"]);
        // Update user context with new avatar
        const currentUser = queryClient.getQueryData(["profile"]);
        if (currentUser?.data) {
          updateUser({
            ...currentUser.data,
            avatar: data.data.avatar,
            avatarUrl: data.data.avatarUrl,
          });
        }
      }
    },
  });
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: authService.deleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      // Update user context to remove avatar
      const currentUser = queryClient.getQueryData(["profile"]);
      if (currentUser?.data) {
        updateUser({
          ...currentUser.data,
          avatar: null,
          avatarUrl: null,
        });
      }
    },
  });
};
