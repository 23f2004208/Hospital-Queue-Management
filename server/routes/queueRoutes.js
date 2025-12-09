const express = require('express');
const router = express.Router();
const {
  getQueueByDepartment,
  getLiveQueueStatus,
  callNextPatient,
  completePatient,
  skipPatient
} = require('../controllers/queueController');
const { protect } = require('../middleware/auth');

// Public route for display screen
router.get('/status/live', getLiveQueueStatus);

// Protected routes
router.get('/:department', protect, getQueueByDepartment);
router.post('/next', protect, callNextPatient);
router.put('/complete/:id', protect, completePatient);
router.put('/skip/:id', protect, skipPatient);

module.exports = router;
