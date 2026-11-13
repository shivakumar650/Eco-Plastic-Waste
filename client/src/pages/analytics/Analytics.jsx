import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart, FiUsers, FiActivity, FiMapPin } from 'react-icons/fi';
import { userService } from '../../services/userService';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import LoadingSpinner from '../../components/LoadingSpinner';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalActivities: 0,
    campaignsJoined: 0,
    resourcesCreated: 0,
    agenciesSubmitted: 0,
    bookmarksCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [activityResponse, userStats] = await Promise.all([
        userService.getActivityHistory({ limit: 100 }),
        userService.getUserStats()
      ]);
      const activities = activityResponse.data.activities || [];
      
      setAnalytics({
        totalActivities: activities.length,
        campaignsJoined: userStats.campaignsJoined,
        resourcesCreated: userStats.resourcesCreated,
        agenciesSubmitted: userStats.agenciesSubmitted,
        bookmarksCount: userStats.bookmarksCount
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Analytics could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const stats = [
    {
      icon: FiActivity,
      label: 'Recent Activities',
      value: analytics.totalActivities,
      color: 'text-blue-500'
    },
    {
      icon: FiUsers,
      label: 'Campaigns Joined',
      value: analytics.campaignsJoined,
      color: 'text-green-500'
    },
    {
      icon: FiBarChart,
      label: 'Resources Created',
      value: analytics.resourcesCreated,
      color: 'text-purple-500'
    },
    {
      icon: FiMapPin,
      label: 'Items Bookmarked',
      value: analytics.bookmarksCount,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your campaign participation and community contributions
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading analytics..." />
            </div>
          ) : error ? (
            <p role="alert" className="text-center text-red-600 dark:text-red-400 py-12">
              {error}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={ANIMATION_VARIANTS.slideUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: index * 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mr-4">
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Your Contributions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {analytics.campaignsJoined}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Campaigns Joined
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {analytics.resourcesCreated}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Resources Created
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {analytics.agenciesSubmitted}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Agencies Submitted
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;