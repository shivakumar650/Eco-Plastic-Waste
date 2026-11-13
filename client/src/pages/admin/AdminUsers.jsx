import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await adminService.getUsers({ limit: 100 });
      setUsers(result.users);
    } catch (requestError) {
      console.error('Failed to load users:', requestError);
      setError('Users could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleUserStatus = async (user) => {
    try {
      const updatedUser = await adminService.updateUserStatus(user._id, !user.isActive);
      setUsers((current) => current.map((entry) => (
        entry._id === user._id ? updatedUser : entry
      )));
      toast.success(`Account ${updatedUser.isActive ? 'activated' : 'deactivated'}`);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Could not update account');
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Permanently delete ${user.email}? This cannot be undone.`)) {
      return;
    }

    try {
      await adminService.deleteUser(user._id);
      setUsers((current) => current.filter((entry) => entry._id !== user._id));
      toast.success('User deleted');
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Could not delete user');
    }
  };

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Users</h1>
      {loading ? (
        <LoadingSpinner size="lg" text="Loading users..." />
      ) : error ? (
        <p role="alert" className="text-red-600 dark:text-red-400">{error}</p>
      ) : users.length === 0 ? (
        <div className="card p-8 text-center text-gray-600 dark:text-gray-400">No users found.</div>
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="p-4">
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="p-4 capitalize">{user.role.replace('_', ' ')}</td>
                  <td className="p-4">{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(user)}
                        className="rounded border px-3 py-1"
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user)}
                        className="rounded border border-red-300 px-3 py-1 text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminUsers;
