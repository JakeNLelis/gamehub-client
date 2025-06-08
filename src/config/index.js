export const config = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  APP_ENV: import.meta.env.VITE_APP_ENV || "development",
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

export const isDevelopment = config.APP_ENV === "development";
export const isProduction = config.APP_ENV === "production";
