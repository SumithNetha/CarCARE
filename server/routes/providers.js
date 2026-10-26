const express = require('express');
const router = express.Router();
const {
  getProviders,
  getProvider,
  getMyProviderProfile,
  updateMyProviderProfile,
  updateAvailability,
  updateProviderById,
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProviders);
router.get('/me/profile', protect, authorize('provider'), getMyProviderProfile);
router.put('/me/profile', protect, authorize('provider'), updateMyProviderProfile);
router.put('/me/availability', protect, authorize('provider'), updateAvailability);
router.get('/:id', getProvider);
router.put('/:id', protect, updateProviderById);

module.exports = router;
