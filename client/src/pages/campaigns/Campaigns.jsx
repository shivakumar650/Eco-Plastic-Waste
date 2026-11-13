import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiCalendar, FiMapPin, FiUsers, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { campaignService } from '../../services/campaignService';
import { ANIMATION_VARIANTS, CAMPAIGN_CATEGORIES, CAMPAIGN_STATUS_OPTIONS } from '../../utils/constants';
import { formatDate, getCategoryColor, getStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({});
  
  const { user, isAuthenticated } = useAuth();

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const { campaigns: results, pagination: pageInfo } =
        await campaignService.getCampaigns(filters);
      setCampaigns(results);
      setPagination(pageInfo);
      
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
      setPagination({ current: 1, pages: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getEventStatus = (campaign) => {
    const now = new Date();
    if (new Date(campaign.startDate) > now) return 'upcoming';
    if (new Date(campaign.endDate) < now) return 'completed';
    return 'active';
  };

  const CampaignCard = ({ campaign }) => (
    <motion.div
      variants={ANIMATION_VARIANTS.slideUp}
      className="card p-6 card-hover"
    >
      {campaign.image && (
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}>
          {campaign.category}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getEventStatus(campaign))}`}>
          {getEventStatus(campaign)}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {campaign.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {campaign.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiCalendar className="mr-2" />
          {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiMapPin className="mr-2" />
          {campaign.location}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiUsers className="mr-2" />
          {campaign.participantCount} participants
          {campaign.maxParticipants && ` / ${campaign.maxParticipants}`}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          by {campaign.organizer?.name}
        </div>
        <Link
          to={`/campaigns/${campaign._id}`}
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
                Awareness Campaigns
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Join impactful campaigns to reduce plastic waste in your community
              </p>
            </div>
            
            {isAuthenticated && (user?.role === 'content_proposer' || user?.role === 'admin') && (
              <Link
                to="/dashboard/campaigns/create"
                className="mt-4 md:mt-0 btn-primary flex items-center"
              >
                <FiPlus className="mr-2" />
                Create Campaign
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
                placeholder="Search campaigns..."
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
              {CAMPAIGN_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              className="form-input"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              {CAMPAIGN_STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                status: '',
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

        {/* Campaigns Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading campaigns..." />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or check back later for new campaigns.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              variants={ANIMATION_VARIANTS.fadeIn}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CampaignCard campaign={campaign} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        page === pagination.current
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Campaigns;