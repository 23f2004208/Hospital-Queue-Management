const Queue = require('../models/Queue');
const Patient = require('../models/Patient');
const { getNextPatient, updateQueuePositions } = require('../utils/queueAlgorithm');
const { getStartOfDay, getEndOfDay } = require('../utils/helpers');

// Get queue by department
const getQueueByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const queue = await Queue.findOne({
      department,
      date: { $gte: getStartOfDay(), $lte: getEndOfDay() }
    }).populate({
      path: 'patients',
      match: { status: { $ne: 'completed' } },
      options: { sort: { position: 1 } }
    }).populate('currentPatient');

    if (!queue) {
      return res.json({
        success: true,
        data: {
          department,
          patients: [],
          currentToken: null,
          totalWaiting: 0,
          totalServed: 0
        }
      });
    }

    res.json({
      success: true,
      data: queue
    });
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ message: 'Error fetching queue', error: error.message });
  }
};

// Get live queue status for all departments
const getLiveQueueStatus = async (req, res) => {
  try {
    const queues = await Queue.find({
      date: { $gte: getStartOfDay(), $lte: getEndOfDay() }
    }).populate('currentPatient');

    // Get waiting counts
    const queueStatus = await Promise.all(
      queues.map(async (queue) => {
        const waitingCount = await Patient.countDocuments({
          department: queue.department,
          status: 'waiting',
          arrivalTime: { $gte: getStartOfDay(), $lte: getEndOfDay() }
        });

        const emergencyCount = await Patient.countDocuments({
          department: queue.department,
          status: 'waiting',
          priority: 'emergency',
          arrivalTime: { $gte: getStartOfDay(), $lte: getEndOfDay() }
        });

        return {
          department: queue.department,
          currentToken: queue.currentToken,
          currentPatient: queue.currentPatient,
          totalWaiting: waitingCount,
          totalServed: queue.totalServed,
          emergencyCount,
          status: queue.status
        };
      })
    );

    res.json({
      success: true,
      data: queueStatus
    });
  } catch (error) {
    console.error('Get live status error:', error);
    res.status(500).json({ message: 'Error fetching live status', error: error.message });
  }
};

// Call next patient
const callNextPatient = async (req, res) => {
  try {
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({ message: 'Department is required' });
    }

    // Get next patient from queue
    const nextPatient = await getNextPatient(department);

    if (!nextPatient) {
      return res.status(404).json({ message: 'No patients waiting in queue' });
    }

    // Update patient status
    nextPatient.status = 'in-progress';
    nextPatient.calledTime = new Date();
    await nextPatient.save();

    // Update queue
    const queue = await Queue.findOne({
      department,
      date: { $gte: getStartOfDay(), $lte: getEndOfDay() }
    });

    if (queue) {
      queue.currentToken = nextPatient.token;
      queue.currentPatient = nextPatient._id;
      await queue.save();
    }

    // Update positions for remaining patients
    await updateQueuePositions(department);

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('token:called', {
        department,
        patient: nextPatient
      });
      req.app.get('io').emit('queue:updated', { department });
    }

    res.json({
      success: true,
      data: nextPatient,
      message: `Token ${nextPatient.token} called`
    });
  } catch (error) {
    console.error('Call next patient error:', error);
    res.status(500).json({ message: 'Error calling next patient', error: error.message });
  }
};

// Complete patient consultation
const completePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.status = 'completed';
    patient.completedTime = new Date();
    await patient.save();

    // Update queue
    const queue = await Queue.findOne({
      department: patient.department,
      date: { $gte: getStartOfDay(), $lte: getEndOfDay() }
    });

    if (queue) {
      queue.totalServed += 1;
      queue.currentToken = null;
      queue.currentPatient = null;
      await queue.save();
    }

    await updateQueuePositions(patient.department);

    if (req.app.get('io')) {
      req.app.get('io').emit('queue:updated', { department: patient.department });
    }

    res.json({
      success: true,
      data: patient,
      message: 'Patient consultation completed'
    });
  } catch (error) {
    console.error('Complete patient error:', error);
    res.status(500).json({ message: 'Error completing patient', error: error.message });
  }
};

// Skip patient
const skipPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.status = 'skipped';
    await patient.save();

    await updateQueuePositions(patient.department);

    if (req.app.get('io')) {
      req.app.get('io').emit('queue:updated', { department: patient.department });
    }

    res.json({
      success: true,
      data: patient,
      message: 'Patient skipped'
    });
  } catch (error) {
    console.error('Skip patient error:', error);
    res.status(500).json({ message: 'Error skipping patient', error: error.message });
  }
};

module.exports = {
  getQueueByDepartment,
  getLiveQueueStatus,
  callNextPatient,
  completePatient,
  skipPatient
};
