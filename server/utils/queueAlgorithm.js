const Patient = require('../models/Patient');

/**
 * Priority Queue Algorithm
 * Sorts patients by priority level and arrival time
 */
const priorityWeights = {
  emergency: 1000,
  high: 100,
  medium: 10,
  low: 1
};

const calculatePriority = (patient) => {
  const priorityWeight = priorityWeights[patient.priority] || 1;
  const timeWeight = new Date() - new Date(patient.arrivalTime);
  const minutesWaiting = Math.floor(timeWeight / 60000);
  
  // Emergency gets immediate priority
  if (patient.priority === 'emergency') {
    return priorityWeight * 10000;
  }
  
  // Others get priority based on weight + waiting time
  return priorityWeight * 100 + minutesWaiting;
};

const sortQueue = (patients) => {
  return patients.sort((a, b) => {
    const priorityA = calculatePriority(a);
    const priorityB = calculatePriority(b);
    
    if (priorityA !== priorityB) {
      return priorityB - priorityA; // Higher priority first
    }
    
    // Same priority, sort by arrival time (FIFO)
    return new Date(a.arrivalTime) - new Date(b.arrivalTime);
  });
};

const calculateEstimatedWaitTime = (position, avgConsultationTime = 15) => {
  return position * avgConsultationTime;
};

const updateQueuePositions = async (department) => {
  try {
    const patients = await Patient.find({
      department,
      status: 'waiting'
    }).sort({ arrivalTime: 1 });

    const sortedPatients = sortQueue(patients);
    
    // Update positions and estimated wait times
    const updates = sortedPatients.map((patient, index) => ({
      updateOne: {
        filter: { _id: patient._id },
        update: {
          position: index + 1,
          estimatedWaitTime: calculateEstimatedWaitTime(index + 1)
        }
      }
    }));

    if (updates.length > 0) {
      await Patient.bulkWrite(updates);
    }

    return sortedPatients;
  } catch (error) {
    console.error('Error updating queue positions:', error);
    throw error;
  }
};

const getNextPatient = async (department) => {
  try {
    const patients = await Patient.find({
      department,
      status: 'waiting'
    }).sort({ arrivalTime: 1 });

    if (patients.length === 0) {
      return null;
    }

    const sortedPatients = sortQueue(patients);
    return sortedPatients[0];
  } catch (error) {
    console.error('Error getting next patient:', error);
    throw error;
  }
};

module.exports = {
  sortQueue,
  calculatePriority,
  calculateEstimatedWaitTime,
  updateQueuePositions,
  getNextPatient
};
