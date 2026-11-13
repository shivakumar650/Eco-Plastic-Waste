import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  FiClock, 
  FiShare2,
  FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { campaignService } from '../../services/campaignService';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import { formatDate, getCategoryColor, getStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const fetchCampaign = useCallback(async () => {
    try {
      setLoading(true);
      const foundCampaign = await campaignService.getCampaign(id);
      setCampaign(foundCampaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast.error('Campaign not found');
      navigate('/campaigns');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign.title,
        text: campaign.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Campaign link copied to clipboard!');
    }
  };

  const handleJoinCampaign = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to join campaigns');
      navigate('/login');
      return;
    }

    try {
      setJoining(true);
      await campaignService.joinCampaign(campaign._id);
      await fetchCampaign();
      toast.success('Successfully joined campaign!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join campaign');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveCampaign = async () => {
    try {
      setJoining(true);
      await campaignService.leaveCampaign(campaign._id);
      await fetchCampaign();
      toast.success('Successfully left campaign');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to leave campaign');
    } finally {
      setJoining(false);
    }
  };

  const isParticipant = campaign?.participants?.some(
    participant => (participant.user?._id || participant.user) === user?.id
  );

  const getEventStatus = () => {
    const now = new Date();
    if (new Date(campaign.startDate) > now) return 'upcoming';
    if (new Date(campaign.endDate) < now) return 'completed';
    return 'active';
  };

  const canJoin = campaign?.status === 'approved' && 
    (!campaign.maxParticipants || campaign.participants.length < campaign.maxParticipants);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading campaign..." />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Campaign not found
          </h2>
          <button
            onClick={() => navigate('/campaigns')}
            className="btn-primary"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/campaigns')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Campaigns
        </button>

        <motion.div
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Campaign image */}
          {campaign.image && (
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(campaign.category)}`}>
                    {campaign.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getEventStatus())}`}>
                    {getEventStatus()}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {campaign.title}
                </h1>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                  <span>Organized by {campaign.organizer?.name}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Campaign info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {campaign.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <FiUsers className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Participants</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {campaign.participants.length}
                    {campaign.maxParticipants && ` / ${campaign.maxParticipants}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                About This Campaign
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* Tags */}
            {campaign.tags && campaign.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Join/Leave button */}
            {campaign.status === 'approved' && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                {isAuthenticated ? (
                  isParticipant ? (
                    <button
                      onClick={handleLeaveCampaign}
                      disabled={joining}
                      className="btn-secondary w-full md:w-auto"
                    >
                      {joining ? <LoadingSpinner size="sm" /> : 'Leave Campaign'}
                    </button>
                  ) : canJoin ? (
                    <button
                      onClick={handleJoinCampaign}
                      disabled={joining}
                      className="btn-primary w-full md:w-auto"
                    >
                      {joining ? <LoadingSpinner size="sm" color="white" /> : 'Join Campaign'}
                    </button>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">
                      Campaign is full
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="btn-primary w-full md:w-auto"
                  >
                    Login to Join Campaign
                  </button>
                )}
              </div>
            )}

            {/* Participants list */}
            {campaign.participants.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Participants ({campaign.participants.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaign.participants.slice(0, 10).map((participant) => (
                    <div
                      key={participant.user._id}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {participant.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {participant.user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Joined {formatDate(participant.joinedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {campaign.participants.length > 10 && (
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    And {campaign.participants.length - 10} more participants...
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CampaignDetail;