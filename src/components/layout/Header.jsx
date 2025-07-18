import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Shield,
  Crown,
  TrendingUp,
} from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    login();
  };
  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };
  return (
    <header className="bg-slate-900 shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
              <img src="/joystick.png" alt="GameHub Logo" className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                GameHub
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Discover Your Next Adventure
              </p>
            </div>{" "}
          </Link>
          {/* Navigation and Auth */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/search"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/trending"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Trending
              </Link>

              {/* Admin Links - Show based on user role */}
              {isAuthenticated &&
                user &&
                (user.role === "admin" || user.role === "superadmin") && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

              {/* SuperAdmin Link - Show only for superadmin */}
              {isAuthenticated && user && user.role === "superadmin" && (
                <Link
                  to="/superadmin"
                  className="flex items-center space-x-1 text-purple-300 hover:text-purple-100 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  <span>SuperAdmin</span>
                </Link>
              )}
            </nav>
            {/* Search Button */}
            <Link
              to="/search"
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors text-gray-300 hover:text-white md:hidden"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
            {/* User Avatar and Dropdown (when authenticated) */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg transition-colors"
                >
                  {" "}
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username || user.name}
                      className="h-8 w-8 rounded-full border-2 border-gray-600"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {(user.username || user.name)
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-700">
                      <p className="text-sm font-medium text-white">
                        {user.username || user.name}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      {/* Role Badge */}
                      {user.role && user.role !== "user" && (
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              user.role === "superadmin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role === "superadmin"
                              ? "Super Admin"
                              : "Admin"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Admin Links in Mobile Dropdown */}
                    {(user.role === "admin" || user.role === "superadmin") && (
                      <div className="md:hidden border-b border-slate-700">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            navigate("/admin");
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-blue-300 hover:bg-slate-700 hover:text-blue-100 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin</span>
                        </button>

                        {user.role === "superadmin" && (
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              navigate("/superadmin");
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-purple-300 hover:bg-slate-700 hover:text-purple-100 transition-colors"
                          >
                            <Crown className="w-4 h-4" />
                            <span>SuperAdmin</span>
                          </button>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/trending");
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors md:hidden"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Trending</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button (when not authenticated) */
              <button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </button>
            )}{" "}
          </div>{" "}
        </div>
      </div>
    </header>
  );
};

export default Header;
