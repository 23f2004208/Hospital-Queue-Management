const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  toggleAvailability,
  getDoctorStats
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected routes (staff and admin)
router.post('/', protect, authorize('admin', 'staff'), createDoctor);
router.put('/:id', protect, authorize('admin', 'staff'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);
router.put('/:id/availability', protect, authorize('admin', 'staff', 'doctor'), toggleAvailability);
router.get('/:id/stats', protect, getDoctorStats);

module.exports = router;
