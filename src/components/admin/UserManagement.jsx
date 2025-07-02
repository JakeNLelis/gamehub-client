import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminService from "../../services/adminService";
import LoadingSpinner from "../common/LoadingSpinner";

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users", currentPage, search, roleFilter],
    queryFn: () =>
      adminService.getUsers({
        page: currentPage,
        limit: 10,
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
      }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      queryClient.invalidateQueries(["admin-stats"]);
    },
  });

  const handleRoleChange = async (userId, currentRole, newRole, userName) => {
    const action = newRole === "user" ? "demote" : "promote";
    const message = `Are you sure you want to ${action} ${userName} to ${newRole}?`;

    if (window.confirm(message)) {
      updateRoleMutation.mutate({ userId, role: newRole });
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-500/20 text-purple-400";
      case "admin":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "superadmin":
        return "Super Admin";
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400">
        Error loading users: {error.message}
      </div>
    );
  }

  const { data: users, pagination } = data;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
          />
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-white"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
            <option value="superadmin">Super Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-600">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-600">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-slate-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username || user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                        <span className="text-gray-300 font-medium">
                          {(user.username || user.name)
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {user.username || user.name}
                      </div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                      {user.username && user.name !== user.username && (
                        <div className="text-xs text-gray-400">{user.name}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {getRoleDisplayName(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {user.role === "user" && (
                      <button
                        onClick={() =>
                          handleRoleChange(
                            user._id,
                            user.role,
                            "admin",
                            user.username || user.name
                          )
                        }
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        disabled={updateRoleMutation.isPending}
                      >
                        Promote to Admin
                      </button>
                    )}

                    {user.role === "admin" && (
                      <>
                        <button
                          onClick={() =>
                            handleRoleChange(
                              user._id,
                              user.role,
                              "superadmin",
                              user.username || user.name
                            )
                          }
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                          disabled={updateRoleMutation.isPending}
                        >
                          Promote to SuperAdmin
                        </button>
                        <button
                          onClick={() =>
                            handleRoleChange(
                              user._id,
                              user.role,
                              "user",
                              user.username || user.name
                            )
                          }
                          className="text-orange-400 hover:text-orange-300 transition-colors"
                          disabled={updateRoleMutation.isPending}
                        >
                          Demote to User
                        </button>
                      </>
                    )}

                    {user.role === "superadmin" && (
                      <button
                        onClick={() =>
                          handleRoleChange(
                            user._id,
                            user.role,
                            "admin",
                            user.username || user.name
                          )
                        }
                        className="text-orange-400 hover:text-orange-300 transition-colors"
                        disabled={updateRoleMutation.isPending}
                      >
                        Demote to Admin
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-300">
            Showing {(pagination.currentPage - 1) * pagination.usersPerPage + 1}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.usersPerPage,
              pagination.totalUsers
            )}{" "}
            of {pagination.totalUsers} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-2 border border-slate-600 rounded-md text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border border-slate-600 rounded-md text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No users found.</p>
        </div>
      )}

      {/* Loading overlay for role updates */}
      {updateRoleMutation.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-600">
            <LoadingSpinner />
            <p className="mt-2 text-gray-300">Updating user role...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
