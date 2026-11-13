import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const pendingRoutes = {
  campaigns: '/admin/campaigns',
  resources: '/admin/resources',
  agencies: '/admin/agencies',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStats(await adminService.getDashboardStats());
      } catch (requestError) {
        console.error('Failed to load admin dashboard:', requestError);
        setError('Dashboard statistics could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  return (
    <section>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Admin Dashboard
      </h1>
      {error ? (
        <p role="alert" className="text-red-600 dark:text-red-400">{error}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(stats.overview).map(([label, value]) => (
              <div key={label} className="card p-6">
                <p className="text-sm capitalize text-gray-500 dark:text-gray-400">
                  {label.replace('total', 'Total ')}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="card mt-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pending moderation
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(stats.pending).map(([type, count]) => (
                <Link
                  key={type}
                  to={pendingRoutes[type]}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-500"
                >
                  <span className="capitalize text-gray-700 dark:text-gray-300">{type}</span>
                  <span className="ml-3 font-semibold text-gray-900 dark:text-white">{count}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card mt-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent users</h2>
            {stats.recentUsers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No users have registered yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.recentUsers.map((user) => (
                  <li key={user._id} className="flex justify-between py-3">
                    <span className="text-gray-900 dark:text-white">{user.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{user.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default AdminDashboard;
