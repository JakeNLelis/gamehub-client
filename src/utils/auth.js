import Cookies from "js-cookie";

// Parse JWT token to get user info (without verification - for client-side display only)
export const parseJWTToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT token:", error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  const decoded = parseJWTToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Get auth headers for API calls
export const getAuthHeaders = () => {
  const token = Cookies.get("authToken");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = Cookies.get("authToken");
  return token && !isTokenExpired(token);
};

// Format API errors for display
export const formatApiError = (error) => {
  // If we have a detailed error message from the API, use that
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    // For validation errors, try to provide more specific information
    if (
      error.response.data.error === "VALIDATION_ERROR" &&
      error.response?.data?.field
    ) {
      return `${error.response.data.field}: ${error.response.data.message}`;
    }
    return error.response.data.error;
  }

  if (error.response?.status === 401) {
    return "You are not authorized to perform this action.";
  }

  if (error.response?.status === 403) {
    return "You do not have permission to access this resource.";
  }

  if (error.response?.status === 404) {
    return "The requested resource was not found.";
  }

  if (error.response?.status === 429) {
    return "Too many requests. Please try again later.";
  }

  if (error.response?.status >= 500) {
    return "Server error. Please try again later.";
  }

  return error.message || "An unexpected error occurred.";
};

// Handle file upload validation
export const validateImageFile = (file, maxSizeInMB = 5) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Please select a valid image file (JPG, PNG, or GIF).",
    };
  }

  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeInMB}MB.`,
    };
  }

  return { isValid: true };
};
