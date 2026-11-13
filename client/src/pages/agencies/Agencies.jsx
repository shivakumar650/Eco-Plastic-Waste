import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiMapPin, FiPhone, FiMail, FiStar, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { agencyService } from '../../services/agencyService';
import { ANIMATION_VARIANTS, AGENCY_TYPES } from '../../utils/constants';
import { getCategoryColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const Agencies = () => {
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pages: 0 });
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    city: '',
    page: 1,
    limit: 12
  });
  const { user, isAuthenticated } = useAuth();

  const filterAgencies = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { agencies: results, pagination: pageInfo } =
        await agencyService.getAgencies(filters);
      setFilteredAgencies(results);
      setPagination(pageInfo);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setError('Agencies could not be loaded. Please try again.');
      setFilteredAgencies([]);
      setPagination({ current: 1, pages: 0 });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    filterAgencies();
  }, [filterAgencies]);

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

  const AgencyCard = ({ agency }) => (
    <motion.div
      variants={ANIMATION_VARIANTS.slideUp}
      className="card p-6 card-hover"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(agency.type)}`}>
          {agency.type.replace('_', ' ')}
        </span>
        <div className="flex items-center">
          <FiStar className="text-yellow-400 mr-1" />
          <span className="text-sm">{agency.rating?.average?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {agency.name}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {agency.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiMapPin className="mr-2" />
          {agency.address?.city}, {agency.address?.state}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiPhone className="mr-2" />
          {agency.contact?.phone}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiMail className="mr-2" />
          {agency.contact?.email}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {agency.services?.length || 0} services
        </div>
        <Link
          to={`/agencies/${agency._id}`}
          className="btn-primary text-sm"
        >
          View Details
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
                Recycling Centers & Agencies
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Find nearby recycling centers and waste management facilities
              </p>
            </div>
            
            {isAuthenticated && (user?.role === 'content_proposer' || user?.role === 'admin') && (
              <Link
                to="/agencies/create"
                className="mt-4 md:mt-0 btn-primary flex items-center"
              >
                <FiPlus className="mr-2" />
                Add Agency
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agencies..."
                className="form-input pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Type */}
            <select
              className="form-input"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {AGENCY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* City */}
            <input
              type="text"
              placeholder="City"
              className="form-input"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />

            {/* Clear filters */}
            <button
              onClick={() => setFilters({
                search: '',
                type: '',
                city: '',
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

        {/* Agencies Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading agencies..." />
          </div>
        ) : error ? (
          <p role="alert" className="py-12 text-center text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : filteredAgencies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No agencies found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or check back later for new agencies.
            </p>
          </div>
        ) : (
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAgencies.map((agency, index) => (
              <motion.div
                key={agency._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AgencyCard agency={agency} />
              </motion.div>
            ))}
          </motion.div>
        )}
        {pagination.pages > 1 && !loading && (
          <nav className="mt-8 flex justify-center gap-2" aria-label="Agency pages">
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

export default Agencies;