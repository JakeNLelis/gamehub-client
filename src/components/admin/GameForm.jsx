import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import adminService from "../../services/adminService";

const GameForm = ({ game, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: game?.title || "",
    thumbnail: game?.thumbnail || "",
    shortDescription: game?.shortDescription || "",
    gameUrl: game?.gameUrl || "",
    genre: game?.genre || [""],
    platform: game?.platform || [""],
    publisher: game?.publisher || "",
    developer: game?.developer || "",
    releaseDate: game?.releaseDate
      ? new Date(game.releaseDate).toISOString().split("T")[0]
      : "",
    backgroundImage: game?.backgroundImage || "",
    minOS: game?.minOS || "",
    minMemory: game?.minMemory || "",
    minStorage: game?.minStorage || "",
    minProcessor: game?.minProcessor || "",
    minGraphics: game?.minGraphics || "",
  });

  const [errors, setErrors] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(
    game?.thumbnail || ""
  );
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [backgroundPreview, setBackgroundPreview] = useState(
    game?.backgroundImage || ""
  );
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);

  const saveGameMutation = useMutation({
    mutationFn: (gameData) => {
      if (game) {
        return adminService.updateGame(game._id, gameData);
      } else {
        return adminService.createGame(gameData);
      }
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error("Save game error:", error);
      setErrors({ general: error.message });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Please select an image file",
      }));
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Image size must be less than 10MB",
      }));
      return;
    }

    try {
      setIsUploadingThumbnail(true);
      setErrors((prev) => ({ ...prev, thumbnail: "" }));

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);

      // Upload to Cloudinary
      const result = await adminService.uploadThumbnail(file);

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: result.data.url,
        }));
        setThumbnailPreview(result.data.url);
        // Clean up the blob URL
        URL.revokeObjectURL(previewUrl);
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Thumbnail upload error:", error);
      setErrors((prev) => ({
        ...prev,
        thumbnail: error.message || "Failed to upload image",
      }));
      // Revert preview on error
      setThumbnailPreview(game?.thumbnail || "");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: "",
    }));
    setThumbnailPreview("");
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleBackgroundUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        backgroundImage: "Please select an image file",
      }));
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        backgroundImage: "Image size must be less than 10MB",
      }));
      return;
    }

    try {
      setIsUploadingBackground(true);
      setErrors((prev) => ({ ...prev, backgroundImage: "" }));

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setBackgroundPreview(previewUrl);

      // Upload to Cloudinary
      const result = await adminService.uploadBackground(file);

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          backgroundImage: result.data.url,
        }));
        setBackgroundPreview(result.data.url);
        // Clean up the blob URL
        URL.revokeObjectURL(previewUrl);
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Background image upload error:", error);
      setErrors((prev) => ({
        ...prev,
        backgroundImage: error.message || "Failed to upload image",
      }));
      // Revert preview on error
      setBackgroundPreview(game?.backgroundImage || "");
    } finally {
      setIsUploadingBackground(false);
    }
  };

  const handleRemoveBackground = () => {
    setFormData((prev) => ({
      ...prev,
      backgroundImage: "",
    }));
    setBackgroundPreview("");
    setErrors((prev) => ({ ...prev, backgroundImage: "" }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.thumbnail.trim())
      newErrors.thumbnail = "Thumbnail image is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Description is required";
    if (!formData.gameUrl.trim()) newErrors.gameUrl = "Game URL is required";
    if (!formData.publisher.trim())
      newErrors.publisher = "Publisher is required";
    if (!formData.developer.trim())
      newErrors.developer = "Developer is required";
    if (!formData.releaseDate)
      newErrors.releaseDate = "Release date is required";

    if (formData.genre.filter((g) => g.trim()).length === 0) {
      newErrors.genre = "At least one genre is required";
    }

    if (formData.platform.filter((p) => p.trim()).length === 0) {
      newErrors.platform = "At least one platform is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Clean up form data
    const cleanedData = {
      ...formData,
      genre: formData.genre.filter((g) => g.trim()),
      platform: formData.platform.filter((p) => p.trim()),
      // Remove empty optional fields
      backgroundImage: formData.backgroundImage || null,
      minOS: formData.minOS || null,
      minMemory: formData.minMemory || null,
      minStorage: formData.minStorage || null,
      minProcessor: formData.minProcessor || null,
      minGraphics: formData.minGraphics || null,
    };

    saveGameMutation.mutate(cleanedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-600">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {game ? "Edit Game" : "Add New Game"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 ${
                    errors.title ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Developer *
                </label>
                <input
                  type="text"
                  name="developer"
                  value={formData.developer}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 ${
                    errors.developer ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.developer && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.developer}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Publisher *
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 ${
                    errors.publisher ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.publisher && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.publisher}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Release Date *
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 ${
                    errors.releaseDate ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.releaseDate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.releaseDate}
                  </p>
                )}
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail Image *
                </label>

                {/* Image Preview */}
                {thumbnailPreview && (
                  <div className="mb-4 relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded-lg border border-slate-600"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                      title="Remove image"
                    >
                      <span className="text-sm font-bold px-2">×</span>
                    </button>
                  </div>
                )}

                {/* File Upload */}
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={isUploadingThumbnail}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                  />

                  {isUploadingThumbnail && (
                    <div className="flex items-center text-blue-400 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                      Uploading image...
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    Upload an image file (JPG, PNG, GIF, WebP) up to 10MB
                  </p>
                </div>

                {errors.thumbnail && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.thumbnail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Game URL *
                </label>
                <input
                  type="url"
                  name="gameUrl"
                  value={formData.gameUrl}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 ${
                    errors.gameUrl ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.gameUrl && (
                  <p className="text-red-400 text-sm mt-1">{errors.gameUrl}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 bg-slate-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 ${
                  errors.shortDescription
                    ? "border-red-500"
                    : "border-slate-600"
                }`}
              />
              {errors.shortDescription && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.shortDescription}
                </p>
              )}
            </div>

            {/* Genre Array */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genres *
              </label>
              {formData.genre.map((genre, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) =>
                      handleArrayChange("genre", index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                    placeholder="Enter genre"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("genre", index)}
                    disabled={formData.genre.length <= 1}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("genre")}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Genre
              </button>
              {errors.genre && (
                <p className="text-red-400 text-sm mt-1">{errors.genre}</p>
              )}
            </div>

            {/* Platform Array */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platforms *
              </label>
              {formData.platform.map((platform, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={platform}
                    onChange={(e) =>
                      handleArrayChange("platform", index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                    placeholder="Enter platform"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("platform", index)}
                    disabled={formData.platform.length <= 1}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("platform")}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Platform
              </button>
              {errors.platform && (
                <p className="text-red-400 text-sm mt-1">{errors.platform}</p>
              )}
            </div>

            {/* System Requirements (Optional) */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                System Requirements (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum OS
                  </label>
                  <input
                    type="text"
                    name="minOS"
                    value={formData.minOS}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Memory
                  </label>
                  <input
                    type="text"
                    name="minMemory"
                    value={formData.minMemory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Storage
                  </label>
                  <input
                    type="text"
                    name="minStorage"
                    value={formData.minStorage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Processor
                  </label>
                  <input
                    type="text"
                    name="minProcessor"
                    value={formData.minProcessor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Graphics
                  </label>
                  <input
                    type="text"
                    name="minGraphics"
                    value={formData.minGraphics}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Background Image (Optional) */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Background Image (Optional)
              </h3>

              {/* Background Image Preview */}
              {backgroundPreview && (
                <div className="mb-4 relative">
                  <img
                    src={backgroundPreview}
                    alt="Background preview"
                    className="w-full h-64 object-cover rounded-lg border border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveBackground}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                    title="Remove background image"
                  >
                    <span className="text-sm font-bold px-2">×</span>
                  </button>
                </div>
              )}

              {/* Background File Upload */}
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  disabled={isUploadingBackground}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                />

                {isUploadingBackground && (
                  <div className="flex items-center text-blue-400 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                    Uploading background image...
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Upload a background image (JPG, PNG, GIF, WebP) up to 10MB.
                  This will be used as the main game background.
                </p>
              </div>

              {errors.backgroundImage && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.backgroundImage}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-600">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
                disabled={saveGameMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                disabled={saveGameMutation.isPending}
              >
                {saveGameMutation.isPending
                  ? "Saving..."
                  : game
                  ? "Update Game"
                  : "Create Game"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GameForm;
