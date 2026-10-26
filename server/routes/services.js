const express = require('express');
const router = express.Router();
const {
  getServices,
  getService,
  addService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getServices)
  .post(protect, authorize('provider', 'admin'), addService);

router.route('/:id')
  .get(getService)
  .put(protect, authorize('provider', 'admin'), updateService)
  .delete(protect, authorize('provider', 'admin'), deleteService);

module.exports = router;
