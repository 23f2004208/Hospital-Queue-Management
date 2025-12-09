const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { getStartOfDay, getEndOfDay } = require('../utils/helpers');

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const { department, available } = req.query;
    
    const filter = {};
    if (department) filter.department = department;
    if (available !== undefined) filter.available = available === 'true';

    const doctors = await Doctor.find(filter).populate('currentPatient');

    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('currentPatient');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
};

// Create doctor
const createDoctor = async (req, res) => {
  try {
    const { name, department, specialization, email, phone, avgConsultationTime, schedule } = req.body;

    if (!name || !department || !specialization || !email || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if email already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    const doctor = await Doctor.create({
      name,
      department,
      specialization,
      email,
      phone,
      avgConsultationTime: avgConsultationTime || 15,
      schedule: schedule || {}
    });

    res.status(201).json({
      success: true,
      data: doctor,
      message: 'Doctor created successfully'
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ message: 'Error creating doctor', error: error.message });
  }
};

// Update doctor
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedDoctor,
      message: 'Doctor updated successfully'
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'Error updating doctor', error: error.message });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await Doctor.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: 'Error deleting doctor', error: error.message });
  }
};

// Toggle doctor availability
const toggleAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.available = !doctor.available;
    doctor.lastActive = new Date();
    await doctor.save();

    res.json({
      success: true,
      data: doctor,
      message: `Doctor ${doctor.available ? 'available' : 'unavailable'}`
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ message: 'Error toggling availability', error: error.message });
  }
};

// Get doctor stats
const getDoctorStats = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    const stats = {
      totalPatients: await Patient.countDocuments({
        doctor: doctor._id,
        arrivalTime: { $gte: todayStart, $lte: todayEnd }
      }),
      completed: await Patient.countDocuments({
        doctor: doctor._id,
        status: 'completed',
        arrivalTime: { $gte: todayStart, $lte: todayEnd }
      }),
      waiting: await Patient.countDocuments({
        doctor: doctor._id,
        status: 'waiting',
        arrivalTime: { $gte: todayStart, $lte: todayEnd }
      }),
      inProgress: await Patient.countDocuments({
        doctor: doctor._id,
        status: 'in-progress',
        arrivalTime: { $gte: todayStart, $lte: todayEnd }
      })
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  toggleAvailability,
  getDoctorStats
};
