const Patient = require('../models/Patient');
const Queue = require('../models/Queue');
const { generateToken } = require('../utils/helpers');
const { updateQueuePositions } = require('../utils/queueAlgorithm');
const { getStartOfDay, getEndOfDay } = require('../utils/helpers');

// Register walk-in patient
const registerPatient = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, phone, email, age, gender, priority, department, symptoms } = req.body;

    // Validate required fields
    if (!name || !phone || !age || !gender || !department) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Count patients in department today
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();
    
    const todayCount = await Patient.countDocuments({
      department,
      arrivalTime: { $gte: todayStart, $lte: todayEnd }
    });

    // Generate token
    const token = generateToken(department, todayCount + 1);

    // Create patient
    const patient = await Patient.create({
      name,
      phone,
      email,
      age,
      gender,
      priority: priority || 'low',
      department,
      symptoms,
      token,
      visitType: 'walk-in'
    });

    // Update or create queue
    let queue = await Queue.findOne({
      department,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (!queue) {
      queue = await Queue.create({
        department,
        date: new Date(),
        patients: [patient._id],
        totalWaiting: 1
      });
    } else {
      queue.patients.push(patient._id);
      queue.totalWaiting = queue.patients.length;
      await queue.save();
    }

    // Update queue positions
    await updateQueuePositions(department);

    // Populate and return
    const updatedPatient = await Patient.findById(patient._id);

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('patient:registered', {
        department,
        patient: updatedPatient
      });
    }

    res.status(201).json({
      success: true,
      data: updatedPatient,
      message: 'Patient registered successfully'
    });
  } catch (error) {
    console.error('Register patient error:', error);
    res.status(500).json({ message: 'Error registering patient', error: error.message });
  }
};

// Check-in appointment
const checkinAppointment = async (req, res) => {
  try {
    const { name, phone, department, appointmentId } = req.body;

    if (!name || !phone || !department) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Similar to registerPatient but with visitType: 'appointment'
    const todayCount = await Patient.countDocuments({
      department,
      arrivalTime: { $gte: getStartOfDay(), $lte: getEndOfDay() }
    });

    const token = generateToken(department, todayCount + 1);

    const patient = await Patient.create({
      ...req.body,
      token,
      visitType: 'appointment'
    });

    await updateQueuePositions(department);

    if (req.app.get('io')) {
      req.app.get('io').emit('patient:registered', { department, patient });
    }

    res.status(201).json({
      success: true,
      data: patient,
      message: 'Checked in successfully'
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Error checking in', error: error.message });
  }
};

// Get patient by ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('doctor');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

// Get patient by token
const getPatientByToken = async (req, res) => {
  try {
    const patient = await Patient.findOne({ token: req.params.token }).populate('doctor');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    console.error('Get patient by token error:', error);
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

// Get all patients (with filters)
const getAllPatients = async (req, res) => {
  try {
    const { status, department, priority, date } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (priority) filter.priority = priority;
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.arrivalTime = { $gte: startDate, $lte: endDate };
    } else {
      // Default to today
      filter.arrivalTime = { $gte: getStartOfDay(), $lte: getEndOfDay() };
    }

    const patients = await Patient.find(filter)
      .populate('doctor')
      .sort({ position: 1, arrivalTime: 1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

// Update patient status
const updatePatientStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.status = status;

    if (status === 'in-progress') {
      patient.calledTime = new Date();
    } else if (status === 'completed' || status === 'skipped') {
      patient.completedTime = new Date();
    }

    await patient.save();
    await updateQueuePositions(patient.department);

    if (req.app.get('io')) {
      req.app.get('io').emit('queue:updated', { department: patient.department });
    }

    res.json({
      success: true,
      data: patient,
      message: 'Patient status updated'
    });
  } catch (error) {
    console.error('Update patient status error:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

module.exports = {
  registerPatient,
  checkinAppointment,
  getPatientById,
  getPatientByToken,
  getAllPatients,
  updatePatientStatus
};
