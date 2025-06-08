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

    try {
      setError("");
      await updateProfileMutation.mutateAsync({ name: editedName.trim() });
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(formatApiError(err));
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>

              {/* Avatar Actions */}
              <div className="absolute -bottom-2 -right-2 flex space-x-1">
                <label className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
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
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {isEditing ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-white/20 text-white placeholder-white/70 px-3 py-2 rounded border border-white/30 focus:border-white focus:outline-none flex-1"
                      placeholder="Enter your name"
                    />
                    <button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(user.name);
                        setError("");
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-white">
                      {user.name}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 text-white p-2 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-white/80">{user.email}</p>
              <p className="text-white/60 text-sm mt-1">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Loading States */}
          {(uploadAvatarMutation.isPending ||
            deleteAvatarMutation.isPending ||
            updateProfileMutation.isPending) && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {uploadAvatarMutation.isPending && "Uploading avatar..."}
                  {deleteAvatarMutation.isPending && "Removing avatar..."}
                  {updateProfileMutation.isPending && "Updating profile..."}
                </span>
              </div>
            </div>
          )}

          {/* Account Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Account Actions
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={logout}
                className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Account
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and will permanently remove all your data, including
              reviews and favorites.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
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
