import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Shield,
  ShieldCheck,
  UserX,
  UserCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter,
  Users,
  AlertCircle,
} from 'lucide-react';
import {
  fetchAllUsers,
  toggleUserAdmin,
  toggleUserActive,
  deleteUser,
} from '../../features/admin/adminSlice.jsx';
import { useToast } from '../UI/ToastProvider.jsx';

const UsersManager = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { users, usersLoading, error } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [processingUser, setProcessingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      !roleFilter ||
      (roleFilter === 'admin' && user.isAdmin) ||
      (roleFilter === 'user' && !user.isAdmin);
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleAdmin = async (userId) => {
    try {
      setProcessingUser(userId);
      await dispatch(toggleUserAdmin(userId)).unwrap();
      toast.success('User admin status updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    } finally {
      setProcessingUser(null);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      setProcessingUser(userId);
      await dispatch(toggleUserActive(userId)).unwrap();
      toast.success('User account status updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    } finally {
      setProcessingUser(null);
    }
  };

  const handleDelete = async (userId) => {
    try {
      setProcessingUser(userId);
      await dispatch(deleteUser(userId)).unwrap();
      toast.success('User deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setProcessingUser(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (usersLoading && users.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-zinc-800 rounded w-48" />
          <div className="h-12 bg-zinc-800 rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
          <p className="text-zinc-400">
            Manage user accounts ({filteredUsers.length} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <div className="relative sm:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-800 rounded-2xl border border-zinc-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700/50">
                <th className="text-left px-6 py-4 text-zinc-400 font-medium text-sm">User</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium text-sm">Role</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium text-sm">Status</th>
                <th className="text-left px-6 py-4 text-zinc-400 font-medium text-sm">Joined</th>
                <th className="text-right px-6 py-4 text-zinc-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => {
                const isActive = user.isActive !== false; // Default to true if undefined
                return (
                  <tr
                    key={user._id}
                    className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-zinc-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-sm font-medium">
                          <Users className="w-3 h-3" />
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isActive ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3" />
                            Disabled
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-zinc-300">{formatDate(user.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleAdmin(user._id)}
                          disabled={processingUser === user._id}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isAdmin
                              ? 'text-purple-400 hover:bg-purple-500/10'
                              : 'text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10'
                          }`}
                          title={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(user._id)}
                          disabled={processingUser === user._id}
                          className={`p-2 rounded-lg transition-colors ${
                            isActive
                              ? 'text-green-400 hover:bg-green-500/10'
                              : 'text-red-400 hover:bg-red-500/10'
                          }`}
                          title={isActive ? 'Disable Account' : 'Enable Account'}
                        >
                          {isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          disabled={processingUser === user._id}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
            <p className="text-zinc-400">
              {searchTerm || roleFilter
                ? 'Try adjusting your search or filters'
                : 'No users registered yet'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-700/50">
            <p className="text-zinc-400 text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-zinc-400 text-sm px-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-6 bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-zinc-400">
          <p className="font-medium text-zinc-300 mb-1">Action Guide:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li><Shield className="w-3 h-3 inline" /> - Toggle admin privileges</li>
            <li><UserCheck className="w-3 h-3 inline" /> / <UserX className="w-3 h-3 inline" /> - Enable or disable user account</li>
            <li><Trash2 className="w-3 h-3 inline" /> - Permanently delete user (admin users cannot be deleted)</li>
          </ul>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-zinc-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Delete User?</h3>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">{deleteConfirm.name}</span>?
              This action cannot be undone and all their data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-zinc-700 text-white rounded-xl font-medium hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                disabled={processingUser === deleteConfirm._id}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {processingUser === deleteConfirm._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
