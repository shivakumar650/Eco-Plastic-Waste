const express = require('express');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { agencySchema, agencyUpdateSchema } = require('../utils/validation');
const {
  getAgencies,
  getAgency,
  createAgency,
  updateAgency,
  deleteAgency,
  addReview,
  getMyAgencies,
  getNearbyAgencies,
  getAgencyTypes
} = require('../controllers/agencyController');

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, getAgencies);
router.get('/nearby', getNearbyAgencies);
router.get('/types', getAgencyTypes);
router.get('/my/agencies', authenticate, authorize('content_proposer', 'admin'), getMyAgencies);
router.get('/:id', optionalAuth, getAgency);

// Protected routes
router.use(authenticate);

// Content proposer and admin routes
router.post('/', authorize('content_proposer', 'admin'), validate(agencySchema), createAgency);
router.put('/:id', authorize('content_proposer', 'admin'), validate(agencyUpdateSchema), updateAgency);
router.delete('/:id', authorize('content_proposer', 'admin'), deleteAgency);
// User interaction routes
router.post('/:id/review', addReview);

module.exports = router;