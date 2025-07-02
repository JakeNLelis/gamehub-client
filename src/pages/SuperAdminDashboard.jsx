import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AdminStats from "../components/admin/AdminStats";
import GameManagement from "../components/admin/GameManagement";
import ReviewManagement from "../components/admin/ReviewManagement";
import UserManagement from "../components/admin/UserManagement";

const SuperAdminDashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Check if user has superadmin role
  if (!user || user.role !== "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "games", name: "Games", icon: "🎮" },
    { id: "reviews", name: "Reviews", icon: "⭐" },
    { id: "users", name: "Users", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome, {user.username || user.name}! You have full administrative
            access.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800 rounded-lg shadow-xl">
          {activeTab === "overview" && <AdminStats />}
          {activeTab === "games" && <GameManagement />}
          {activeTab === "reviews" && <ReviewManagement />}
          {activeTab === "users" && <UserManagement />}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
