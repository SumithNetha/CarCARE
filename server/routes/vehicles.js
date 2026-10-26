const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicle,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('customer'));

router.route('/')
  .get(getVehicles)
  .post(addVehicle);

router.route('/:id')
  .get(getVehicle)
  .put(updateVehicle)
  .delete(deleteVehicle);

module.exports = router;
