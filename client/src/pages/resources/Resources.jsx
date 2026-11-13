import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiBookOpen, FiPlay, FiClock, FiHeart, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { resourceService } from '../../services/resourceService';
import { ANIMATION_VARIANTS, RESOURCE_CATEGORIES } from '../../utils/constants';
import { getCategoryColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pages: 0 });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1,
    limit: 12
  });
  const { user, isAuthenticated } = useAuth();

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { resources: results, pagination: pageInfo } =
        await resourceService.getResources(filters);
      setResources(results);
      setPagination(pageInfo);
      
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Resources could not be loaded. Please try again.');
      setResources([]);
      setPagination({ current: 1, pages: 0 });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters((current) => ({ ...current, page }));
  };

  const ResourceCard = ({ resource }) => (
    <motion.div
      variants={ANIMATION_VARIANTS.slideUp}
      className="card p-6 card-hover h-full flex flex-col"
    >
      {resource.thumbnail && (
        <img
          src={resource.thumbnail}
          alt={resource.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
          {resource.category}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {resource.readTime} min read
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {resource.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
        {resource.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FiHeart className="mr-1" />
            {resource.likeCount || 0}
          </div>
          <div className="flex items-center">
            <FiBookOpen className="mr-1" />
            {resource.views || 0}
          </div>
        </div>
        <Link
          to={`/resources/${resource._id}`}
          className="btn-primary text-sm"
        >
          Read More
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Educational Resources
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Discover tips, guides, and research on plastic waste reduction
              </p>
            </div>
            
            {isAuthenticated && (user?.role === 'content_proposer' || user?.role === 'admin') && (
              <Link
                to="/dashboard/resources/create"
                className="mt-4 md:mt-0 btn-primary flex items-center"
              >
                <FiPlus className="mr-2" />
                Add Resource
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="form-input pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Category */}
            <select
              className="form-input"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {RESOURCE_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                page: 1,
                limit: 12
              })}
              className="btn-secondary flex items-center justify-center"
            >
              <FiFilter className="mr-2" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading resources..." />
          </div>
        ) : error ? (
          <p role="alert" className="py-12 text-center text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or check back later for new resources.
            </p>
          </div>
        ) : (
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resources.map((resource, index) => (
              <motion.div
                key={resource._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </motion.div>
        )}
        {pagination.pages > 1 && !loading && (
          <nav className="mt-8 flex justify-center gap-2" aria-label="Resource pages">
            {Array.from({ length: pagination.pages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                aria-current={page === pagination.current ? 'page' : undefined}
                className={`rounded px-3 py-2 ${
                  page === pagination.current
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default Resources;