import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const error = searchParams.get("error");
        const code = searchParams.get("code");

        console.log("OAuthCallback - URL params:", {
          token,
          refreshToken,
          error,
          code,
        });
        console.log("OAuthCallback - Current URL:", window.location.href);

        if (error) {
          console.error("OAuth error:", error);
          navigate("/login?error=" + encodeURIComponent(error));
          return;
        }

        // If we have tokens in URL params (expected flow)
        if (token) {
          console.log("Token found, handling OAuth callback...");
          handleOAuthCallback(token, refreshToken);
          // Redirect to homepage or intended page
          const intendedPath = sessionStorage.getItem("intendedPath") || "/";
          sessionStorage.removeItem("intendedPath");
          navigate(intendedPath, { replace: true });
          return;
        }

        // If we have an authorization code (Google OAuth code flow)
        if (code) {
          console.log("Authorization code found, exchanging for tokens...");
          try {
            // Exchange the code for tokens by calling our backend
            const response = await fetch(
              `/api/auth/google/callback?code=${code}`,
              {
                method: "GET",
                credentials: "include",
              }
            );

            if (response.ok) {
              const data = await response.json();
              console.log("Token exchange successful:", data);

              if (data.token) {
                handleOAuthCallback(data.token, data.refreshToken);
                const intendedPath =
                  sessionStorage.getItem("intendedPath") || "/";
                sessionStorage.removeItem("intendedPath");
                navigate(intendedPath, { replace: true });
                return;
              }
            } else {
              throw new Error(`Token exchange failed: ${response.status}`);
            }
          } catch (exchangeError) {
            console.error("Token exchange error:", exchangeError);
            navigate(
              "/login?error=" +
                encodeURIComponent("Authentication failed. Please try again.")
            );
            return;
          }
        }

        // If we're on the actual callback URL (backend JSON response)
        if (window.location.pathname.includes("/api/auth/google/callback")) {
          console.log("Detected backend callback URL, extracting response...");

          try {
            // Try to extract JSON data from the current page
            const pageText =
              document.body.innerText || document.body.textContent;
            if (pageText) {
              const jsonMatch = pageText.match(/\{.*\}/);
              if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                console.log("Extracted JSON data:", data);

                if (data.token) {
                  handleOAuthCallback(data.token, data.refreshToken);
                  const intendedPath =
                    sessionStorage.getItem("intendedPath") || "/";
                  sessionStorage.removeItem("intendedPath");
                  navigate(intendedPath, { replace: true });
                  return;
                }
              }
            }
          } catch (parseError) {
            console.error("Failed to parse backend response:", parseError);
          }
        }

        // If nothing worked, redirect to login with error
        console.warn("No valid authentication data found");
        navigate(
          "/login?error=" +
            encodeURIComponent("Authentication failed. Please try again.")
        );
      } catch (error) {
        console.error("OAuth callback processing error:", error);
        navigate(
          "/login?error=" +
            encodeURIComponent("Authentication failed. Please try again.")
        );
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, handleOAuthCallback]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="text-white mt-4 text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
