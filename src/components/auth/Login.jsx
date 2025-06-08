import React, { useState, useEffect } from "react";
import { LogIn, Shield, Gamepad2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, loading, user, isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect to homepage if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      login(); // Use redirect method only
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">GameHub</h1>
            <p className="text-gray-300">
              Welcome to the ultimate gaming community
            </p>
          </div>

          {/* Login Card */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-2">
                Sign in to your account
              </h2>
              <p className="text-gray-400 text-sm">
                Connect with gamers and discover amazing games
              </p>
            </div>{" "}
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-3 transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{loading ? "Signing in..." : "Continue with Google"}</span>
            </button>
            {/* Features */}
            <div className="space-y-3 pt-4 border-t border-white/20">
              <div className="flex items-center space-x-3 text-gray-300">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">
                  Secure authentication with Google
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <LogIn className="w-5 h-5 text-blue-400" />
                <span className="text-sm">
                  Access to exclusive game reviews
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
                <span className="text-sm">
                  Create your personal game library
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          By signing in, you agree to our terms of service and privacy policy
        </div>
      </div>
    </div>
  );
};

export default Login;
