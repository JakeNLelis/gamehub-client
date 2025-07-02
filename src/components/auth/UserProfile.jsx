import React, { useState } from "react";
import { User, Camera, Trash2, Edit, Save, X, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import {
  useUpdateProfile,
  useUploadAvatar,
  useDeleteAvatar,
} from "../../hooks/useAuth.js";
import { validateImageFile, formatApiError } from "../../utils/auth.js";
import LoadingSpinner from "../common/LoadingSpinner.jsx";

const UserProfile = () => {
  const { user, logout, deleteAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedUsername, setEditedUsername] = useState(user?.username || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      setError("Name is required");
      return;
    }

    if (!editedUsername.trim()) {
      setError("Username is required");
      return;
    }

    // Client-side username validation
    if (editedUsername.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (!/^[a-zA-Z0-9._]+$/.test(editedUsername.trim())) {
      setError(
        "Username can only contain letters, numbers, dots, and underscores"
      );
      return;
    }

    try {
      setError("");
      await updateProfileMutation.mutateAsync({
        name: editedName.trim(),
        username: editedUsername.trim(),
      });
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMessage = formatApiError(err);

      // More user-friendly error for duplicate username
      if (errorMessage.includes("username is already taken")) {
        setError(
          `Username '@${editedUsername.trim()}' is already taken. Please choose a different one.`
        );
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    try {
      setError("");
      await uploadAvatarMutation.mutateAsync(file);
      setSuccess("Avatar updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setError("");
      await deleteAvatarMutation.mutateAsync();
      setSuccess("Avatar removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError("");
      const result = await deleteAccount();
      if (!result.success) {
        setError(result.error || "Failed to delete account");
      }
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  if (!user) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="w-full">
      {/* Alerts */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Loading States */}
      {(uploadAvatarMutation.isPending ||
        deleteAvatarMutation.isPending ||
        updateProfileMutation.isPending) && (
        <div className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span>
              {uploadAvatarMutation.isPending && "Uploading avatar..."}
              {deleteAvatarMutation.isPending && "Removing avatar..."}
              {updateProfileMutation.isPending && "Updating profile..."}
            </span>
          </div>
        </div>
      )}

      {/* Main Profile Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
        {/* Left Side - User Info */}
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden ring-4 ring-slate-600">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>

            {/* Avatar Actions */}
            <div className="absolute -bottom-1 -right-1 flex space-x-1">
              <label className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full cursor-pointer transition-colors shadow-lg">
                <Camera className="w-3 h-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadAvatarMutation.isPending}
                />
              </label>

              {user.avatarUrl && (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={deleteAvatarMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-colors disabled:opacity-50 shadow-lg"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {isEditing ? (
                <div className="flex flex-col space-y-2 flex-1">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className={`bg-slate-700 text-white placeholder-gray-400 px-3 py-2 rounded-lg border ${
                      error && error.toLowerCase().includes("name")
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-slate-600 focus:ring-blue-500/20"
                    } focus:border-blue-500 focus:ring-2 focus:outline-none w-full`}
                    placeholder="Enter your name"
                  />
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className={`bg-slate-700 text-white placeholder-gray-400 px-3 py-2 rounded-lg border ${
                      error && error.toLowerCase().includes("username")
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-slate-600 focus:ring-blue-500/20"
                    } focus:border-blue-500 focus:ring-2 focus:outline-none w-full`}
                    placeholder="Enter your username"
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-1" /> Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(user.name);
                        setEditedUsername(user.username);
                        setError("");
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-white">{user.name}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white p-2 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            <p className="text-gray-300 text-[1rem]">{user.email}</p>
            {user.username && (
              <p className="text-blue-400 text-[1rem] font-medium">
                @{user.username}
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Account Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:ml-6">
          <button
            onClick={logout}
            className="flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors min-w-[120px]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors min-w-[120px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              Delete Account
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and will permanently remove all your data, including
              reviews and favorites.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
