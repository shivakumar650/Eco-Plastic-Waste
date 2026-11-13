import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiHeart, FiBookmark, FiShare2, FiEye } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { resourceService } from '../../services/resourceService';
import { userService } from '../../services/userService';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import { formatDate, getCategoryColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const checkBookmarkStatus = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await userService.getBookmarks();
        const isBookmarked = response.data.some(
          bookmark => bookmark.resourceType === 'resource' && 
                     bookmark.resourceId._id === id
        );
        setIsBookmarked(isBookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    }
  }, [id, isAuthenticated]);

  const fetchResource = useCallback(async () => {
    try {
      setLoading(true);
      const foundResource = await resourceService.getResource(id);
      setResource(foundResource);
      if (isAuthenticated && user) {
        setIsLiked(foundResource.likes?.some(
          like => (like.user?._id || like.user) === user.id
        ));
      }
    } catch (error) {
      console.error('Error fetching resource:', error);
      toast.error('Resource not found');
      navigate('/resources');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, navigate, user]);

  useEffect(() => {
    fetchResource();
    checkBookmarkStatus();
  }, [fetchResource, checkBookmarkStatus]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like resources');
      return;
    }

    try {
      const result = await resourceService.toggleLike(resource._id);
      setIsLiked(result.liked);
      setResource(prev => ({ ...prev, likeCount: result.likeCount }));
      toast.success(result.liked ? 'Resource liked' : 'Like removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update like');
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark resources');
      return;
    }

    try {
      if (isBookmarked) {
        await userService.removeBookmark({ resourceType: 'resource', resourceId: resource._id });
        setIsBookmarked(false);
        toast.success('Bookmark removed');
      } else {
        await userService.addBookmark({ resourceType: 'resource', resourceId: resource._id });
        setIsBookmarked(true);
        toast.success('Resource bookmarked');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading resource..." />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Resource not found
          </h2>
          <button onClick={() => navigate('/resources')} className="btn-primary">
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/resources')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Resources
        </button>

        <motion.article
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {resource.thumbnail && (
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(resource.category)}`}>
                  {resource.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(resource.difficulty)}`}>
                  {resource.difficulty}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-lg border transition-colors ${
                    isLiked 
                      ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
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
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {resource.title}
            </h1>

            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center">
                <FiClock className="mr-1" />
                {resource.readTime} min read
              </div>
              <div className="flex items-center">
                <FiEye className="mr-1" />
                {resource.views} views
              </div>
              <div className="flex items-center">
                <FiHeart className="mr-1" />
                {resource.likeCount} likes
              </div>
              <span>By {resource.author?.name}</span>
              <span>{formatDate(resource.createdAt)}</span>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {resource.description}
              </p>
              
              <div className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
                {resource.content}
              </div>
            </div>

            {resource.url && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  External Link
                </h3>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Visit Resource →
                </a>
              </div>
            )}

            {resource.tags && resource.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
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
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default ResourceDetail;