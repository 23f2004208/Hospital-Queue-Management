const express = require('express');
const router = express.Router();
const {
  registerPatient,
  checkinAppointment,
  getPatientById,
  getPatientByToken,
  getAllPatients,
  updatePatientStatus
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerPatient);
router.post('/checkin', checkinAppointment);
router.get('/token/:token', getPatientByToken);

// Protected routes
router.get('/', protect, getAllPatients);
router.get('/:id', protect, getPatientById);
router.put('/:id/status', protect, updatePatientStatus);

module.exports = router;
