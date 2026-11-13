import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiGlobe, 
  FiClock,
  FiStar,
  FiBookmark
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { agencyService } from '../../services/agencyService';
import { userService } from '../../services/userService';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import { getCategoryColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AgencyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const checkBookmarkStatus = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await userService.getBookmarks();
        const isBookmarked = response.data.some(
          bookmark => bookmark.resourceType === 'agency' && 
                     bookmark.resourceId._id === id
        );
        setIsBookmarked(isBookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    }
  }, [id, isAuthenticated]);

  const fetchAgency = useCallback(async () => {
    try {
      setLoading(true);
      const foundAgency = await agencyService.getAgency(id);
      setAgency(foundAgency);
    } catch (error) {
      console.error('Error fetching agency:', error);
      toast.error('Agency not found');
      navigate('/agencies');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchAgency();
    checkBookmarkStatus();
  }, [fetchAgency, checkBookmarkStatus]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark agencies');
      return;
    }

    try {
      if (isBookmarked) {
        await userService.removeBookmark({ resourceType: 'agency', resourceId: agency._id });
        setIsBookmarked(false);
        toast.success('Bookmark removed');
      } else {
        await userService.addBookmark({ resourceType: 'agency', resourceId: agency._id });
        setIsBookmarked(true);
        toast.success('Agency bookmarked');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading agency..." />
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Agency not found
          </h2>
          <button onClick={() => navigate('/agencies')} className="btn-primary">
            Back to Agencies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/agencies')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Agencies
        </button>

        <motion.div
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(agency.type)}`}>
                    {agency.type.replace('_', ' ')}
                  </span>
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span className="font-medium">{agency.rating?.average?.toFixed(1) || 'N/A'}</span>
                    <span className="text-gray-500 ml-1">({agency.rating?.count || 0} reviews)</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {agency.name}
                </h1>
              </div>

              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {agency.description}
            </p>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">{agency.contact.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                    <a 
                      href={`mailto:${agency.contact.email}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      {agency.contact.email}
                    </a>
                  </div>
                  {agency.contact.website && (
                    <div className="flex items-center">
                      <FiGlobe className="w-5 h-5 text-gray-400 mr-3" />
                      <a 
                        href={agency.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Address
                </h3>
                <div className="flex items-start">
                  <FiMapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                  <div className="text-gray-900 dark:text-white">
                    <div>{agency.address.street}</div>
                    <div>{agency.address.city}, {agency.address.state} {agency.address.zipCode}</div>
                    <div>{agency.address.country}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Services Offered
              </h3>
              <div className="flex flex-wrap gap-2">
                {agency.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    {service.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Accepted Materials */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Accepted Materials
              </h3>
              <div className="flex flex-wrap gap-2">
                {agency.acceptedMaterials.map((material, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm"
                  >
                    {material.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Operating Hours */}
            {agency.operatingHours && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Operating Hours
                </h3>
                <div className="flex items-center">
                  <FiClock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-white">
                    {agency.operatingHours}
                  </span>
                </div>
              </div>
            )}

            {/* Reviews */}
            {agency.reviews && agency.reviews.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Reviews
                </h3>
                <div className="space-y-4">
                  {agency.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="border-l-4 border-primary-200 dark:border-primary-800 pl-4">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {review.user?.name || 'Anonymous'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgencyDetail;